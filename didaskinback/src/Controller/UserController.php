<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;

#[Route('/users', name: 'app_users')]
class UserController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private SerializerInterface $serializer
    ) {
    }


    // === GESTION DES UTILISATEURS ===

    #[Route('', name: 'list_users', methods: ['GET'])]
    public function listUsers(): JsonResponse
    {
        $users = $this->userRepository->findAllOrderedByCreatedAt();
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $data = $this->serializer->serialize($users, 'json', $context);
        $data = json_decode($data, true);
       
        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('/create', name: 'create_user', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation des données
        if (!$data || !isset($data['firstName'], $data['lastName'], $data['email'], $data['phoneNumber'])) {
            return $this->json([
                'success' => false,
                'error' => 'Données manquantes'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'email existe déjà
        $existingUser = $this->userRepository->findByEmail($data['email']);
        if ($existingUser) {
            return $this->json([
                'success' => false,
                'error' => 'Un utilisateur avec cet email existe déjà'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Créer le nouvel utilisateur
        $user = new User();
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setEmail($data['email']);
        $user->setPhoneNumber($data['phoneNumber']);
        $user->setRole($data['role'] ?? 'ROLE_USER');
        $user->setIsSubscribed($data['is_subscribed'] ?? false);
        $user->setPassword('temporary_password_' . uniqid());
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());

        // Valider l'entité
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'errors' => $this->getErrorsFromValidator($errors)
            ], Response::HTTP_BAD_REQUEST);
        }

        // Persister l'utilisateur
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Sérialiser la réponse
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($user, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
            'message' => 'Utilisateur créé avec succès'
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'show_user', methods: ['GET'])]
    public function showUser(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Utilisateur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $data = $this->serializer->serialize($user, 'json', $context);
        $data = json_decode($data, true);

        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('/{id}', name: 'update_user', methods: ['PUT'])]
    public function updateUser(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Utilisateur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
        if (isset($data['email'])) {
            $existingUser = $this->userRepository->findByEmail($data['email']);
            if ($existingUser && $existingUser->getId() !== $id) {
                return $this->json([
                    'success' => false,
                    'error' => 'Un utilisateur avec cet email existe déjà'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $user->setUpdatedAt(new \DateTimeImmutable());
        $user = $this->userRepository->update($user, $data);
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($user, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
            'message' => 'Utilisateur mis à jour avec succès'
        ]);
    }

    #[Route('/{id}', name: 'delete_user', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Utilisateur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        $this->userRepository->remove($user, true);

        return $this->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    // === GESTION NEWSLETTER ===

    #[Route('/{id}/subscribe-newsletter', name: 'subscribe_newsletter', methods: ['POST'])]
    public function subscribeToNewsletter(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Utilisateur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        $user->setIsSubscribed(true);
        $user->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Utilisateur abonné à la newsletter avec succès'
        ]);
    }

    #[Route('/{id}/unsubscribe-newsletter', name: 'unsubscribe_newsletter', methods: ['POST'])]
    public function unsubscribeFromNewsletter(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Utilisateur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        $user->setIsSubscribed(false);
        $user->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Utilisateur désabonné de la newsletter avec succès'
        ]);
    }

    // === ENDPOINTS UTILITAIRES ===

    #[Route('/subscribed', name: 'subscribed_users', methods: ['GET'])]
    public function getSubscribedUsers(): JsonResponse
    {
        $users = $this->userRepository->findSubscribedUsers();
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $data = $this->serializer->serialize($users, 'json', $context);
        $data = json_decode($data, true);

        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('/admins', name: 'list_admins', methods: ['GET'])]
    public function listAdmins(): JsonResponse
    {
        $admins = $this->userRepository->findByRole('ROLE_ADMIN');
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $data = $this->serializer->serialize($admins, 'json', $context);
        $data = json_decode($data, true);

        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('/by-role/{role}', name: 'users_by_role', methods: ['GET'])]
    public function getUsersByRole(string $role): JsonResponse
    {
        $users = $this->userRepository->findByRole($role);
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $data = $this->serializer->serialize($users, 'json', $context);
        $data = json_decode($data, true);

        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    private function getErrorsFromValidator($errors): array
    {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        return $errorMessages;
    }
} 