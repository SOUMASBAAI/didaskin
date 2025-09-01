<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Notification;
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
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/users', name: 'app_users')]
class UserController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private SerializerInterface $serializer
    ) {}

    // === UTILISATEURS ===

    #[Route('', name: 'list_users', methods: ['GET'])]
    public function listUsers(): JsonResponse
    {
        $users = $this->userRepository->findAllOrderedByCreatedAt();
        $data = $this->serializeUsers($users);
        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('/create', name: 'create_user', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function createUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['firstName'], $data['lastName'], $data['email'], $data['phoneNumber'])) {
            return $this->json(['success' => false, 'error' => 'Données manquantes'], Response::HTTP_BAD_REQUEST);
        }

        if ($this->userRepository->findByEmail($data['email'])) {
            return $this->json(['success' => false, 'error' => 'Un utilisateur avec cet email existe déjà'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setFirstName($data['firstName'])
             ->setLastName($data['lastName'])
             ->setEmail($data['email'])
             ->setPhoneNumber($data['phoneNumber'])
             ->setRole($data['role'] ?? 'ROLE_USER')
             ->setIsSubscribed($data['is_subscribed'] ?? false)
             ->setPassword('temporary_password_' . uniqid())
             ->setCreatedAt(new \DateTimeImmutable())
             ->setUpdatedAt(new \DateTimeImmutable());

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['success' => false, 'errors' => $this->getErrorsFromValidator($errors)], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Notification si abonné
        if ($user->isSubscribed()) {
            $this->notifyAdmins($user);
        }

        return $this->json([
            'success' => true,
            'data' => $this->serializeUsers($user),
            'message' => 'Utilisateur créé avec succès'
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'show_user', methods: ['GET'])]
    public function showUser(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }
        return $this->json(['success' => true, 'data' => $this->serializeUsers($user)]);
    }

    #[Route('/{id}', name: 'update_user', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateUser(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->userRepository->find($id);

        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if (isset($data['email'])) {
            $existingUser = $this->userRepository->findByEmail($data['email']);
            if ($existingUser && $existingUser->getId() !== $id) {
                return $this->json(['success' => false, 'error' => 'Un utilisateur avec cet email existe déjà'], Response::HTTP_BAD_REQUEST);
            }
        }

        $wasSubscribed = $user->isSubscribed();
        $user->setUpdatedAt(new \DateTimeImmutable());
        $user = $this->userRepository->update($user, $data);

        if (!$wasSubscribed && $user->isSubscribed()) {
            $this->notifyAdmins($user);
        }

        return $this->json(['success' => true, 'data' => $this->serializeUsers($user), 'message' => 'Utilisateur mis à jour avec succès']);
    }

    #[Route('/{id}', name: 'delete_user', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteUser(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $this->userRepository->remove($user, true);
        return $this->json(['success' => true, 'message' => 'Utilisateur supprimé avec succès']);
    }

    // === NEWSLETTER ===

    #[Route('/{id}/subscribe-newsletter', name: 'subscribe_newsletter', methods: ['POST'])]
    public function subscribeToNewsletter(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if ($user->isSubscribed()) {
            return $this->json(['success' => false, 'error' => 'Utilisateur déjà abonné à la newsletter'], Response::HTTP_BAD_REQUEST);
        }

        $user->setIsSubscribed(true);
        $user->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        $this->notifyAdmins($user);

        return $this->json(['success' => true, 'message' => 'Utilisateur abonné à la newsletter avec succès']);
    }

    #[Route('/{id}/unsubscribe-newsletter', name: 'unsubscribe_newsletter', methods: ['POST'])]
    public function unsubscribeFromNewsletter(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return $this->json(['success' => false, 'error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $user->setIsSubscribed(false);
        $user->setUpdatedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json(['success' => true, 'message' => 'Utilisateur désabonné de la newsletter avec succès']);
    }

    // === ENDPOINTS UTILITAIRES ===

    #[Route('/subscribed', name: 'subscribed_users', methods: ['GET'])]
    public function getSubscribedUsers(): JsonResponse
    {
        $users = $this->userRepository->findSubscribedUsers();
        return $this->json(['success' => true, 'data' => $this->serializeUsers($users)]);
    }

    #[Route('/admins', name: 'list_admins', methods: ['GET'])]
    public function listAdmins(): JsonResponse
    {
        $admins = $this->userRepository->findByRole('ROLE_ADMIN');
        return $this->json(['success' => true, 'data' => $this->serializeUsers($admins)]);
    }

    #[Route('/by-role/{role}', name: 'users_by_role', methods: ['GET'])]
    public function getUsersByRole(string $role): JsonResponse
    {
        $users = $this->userRepository->findByRole($role);
        return $this->json(['success' => true, 'data' => $this->serializeUsers($users)]);
    }

    // === UTILS ===

    private function getErrorsFromValidator($errors): array
    {
        $messages = [];
        foreach ($errors as $error) {
            $messages[] = $error->getMessage();
        }
        return $messages;
    }

    private function serializeUsers($users): array
    {
        $context = (new ObjectNormalizerContextBuilder())->withGroups('user:read')->toArray();
        $data = $this->serializer->serialize($users, 'json', $context);
        return json_decode($data, true);
    }

    private function notifyAdmins(User $user): void
    {
        $admins = $this->userRepository->findByRole('ROLE_ADMIN');
        if (empty($admins)) return;

        $notification = (new Notification())
            ->setSlug('newsletter_subscribe')
            ->setLabel('Nouvelle inscription newsletter')
            ->setMessage(sprintf('%s %s s\'est inscrit(e) à la newsletter', $user->getFirstName(), $user->getLastName()))
            ->setIsRead(false);

        foreach ($admins as $admin) {
            $notification->addReceiver($admin);
        }

        $this->entityManager->persist($notification);
        $this->entityManager->flush();
    }
}
