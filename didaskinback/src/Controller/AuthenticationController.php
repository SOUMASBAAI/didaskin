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
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;

#[Route('/auth', name: 'app_auth')]
class AuthenticationController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private UserPasswordHasherInterface $passwordHasher,
        private SerializerInterface $serializer
    ) {
    }

    // === INSCRIPTION UTILISATEUR ===

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier si l'email existe déjà
        $existingUser = $this->userRepository->findByEmail($data['email'] ?? '');
        if ($existingUser) {
            return $this->json([
                'success' => false,
                'error' => 'Un utilisateur avec cet email existe déjà'
            ], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setFirstName($data['firstName'] ?? '');
        $user->setLastName($data['lastName'] ?? '');
        $user->setEmail($data['email'] ?? '');
        $user->setPhoneNumber($data['phoneNumber'] ?? '');
        $user->setRole('ROLE_USER');
        $user->setIsSubscribed(false);
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());

        // Hasher le mot de passe
        if (isset($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        } else {
            return $this->json([
                'success' => false,
                'error' => 'Le mot de passe est requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'errors' => $this->getErrorsFromValidator($errors),
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Générer un token JWT simple (sans bundle pour l'instant)
        $token = $this->generateSimpleJWT($user);

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($user, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => [
                'user' => $serializedData,
                'token' => $token,
                'expires_in' => 3600 // 1 heure
            ],
            'message' => 'Inscription réussie'
        ], Response::HTTP_CREATED);
    }

    // === CONNEXION UTILISATEUR ===

    #[Route('/auth/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $user = $this->userRepository->findByEmail($data['email'] ?? '');
        
        if (!$user || !$this->passwordHasher->isPasswordValid($user, $data['password'] ?? '')) {
            return $this->json([
                'success' => false,
                'error' => 'Email ou mot de passe incorrect'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Générer un token JWT simple
        $token = $this->generateSimpleJWT($user);

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($user, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => [
                'user' => $serializedData,
                'token' => $token,
                'expires_in' => 3600
            ],
            'message' => 'Connexion réussie'
        ]);
    }

    // === INSCRIPTION ADMIN ===

    #[Route('/admin/register', name: 'admin_register', methods: ['POST'])]
    public function adminRegister(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier si l'email existe déjà
        $existingUser = $this->userRepository->findByEmail($data['email'] ?? '');
        if ($existingUser) {
            return $this->json([
                'success' => false,
                'error' => 'Un administrateur avec cet email existe déjà'
            ], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setFirstName($data['firstName'] ?? '');
        $user->setLastName($data['lastName'] ?? '');
        $user->setEmail($data['email'] ?? '');
        $user->setPhoneNumber($data['phoneNumber'] ?? '');
        $user->setRole('ROLE_ADMIN');
        $user->setIsSubscribed(false);
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());

        // Hasher le mot de passe
        if (isset($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        } else {
            return $this->json([
                'success' => false,
                'error' => 'Le mot de passe est requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'errors' => $this->getErrorsFromValidator($errors),
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Générer un token JWT simple
        $token = $this->generateSimpleJWT($user);

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($user, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => [
                'user' => $serializedData,
                'token' => $token,
                'expires_in' => 3600
            ],
            'message' => 'Administrateur créé avec succès'
        ], Response::HTTP_CREATED);
    }

    // === CONNEXION ADMIN ===

    #[Route('/admin/login', name: 'admin_login', methods: ['POST'])]
    public function adminLogin(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $user = $this->userRepository->findByEmail($data['email'] ?? '');
        
        if (!$user || !$this->passwordHasher->isPasswordValid($user, $data['password'] ?? '')) {
            return $this->json([
                'success' => false,
                'error' => 'Email ou mot de passe incorrect'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Vérifier que c'est un admin
        if ($user->getRole() !== 'ROLE_ADMIN') {
            return $this->json([
                'success' => false,
                'error' => 'Accès non autorisé - Admin requis'
            ], Response::HTTP_FORBIDDEN);
        }

        // Générer un token JWT simple
        $token = $this->generateSimpleJWT($user);

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($user, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => [
                'user' => $serializedData,
                'token' => $token,
                'expires_in' => 3600
            ],
            'message' => 'Connexion admin réussie'
        ]);
    }

    // === PROFIL UTILISATEUR ===

    #[Route('/profile', name: 'profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        // Pour l'instant, on simule un utilisateur connecté
        // Plus tard, on récupérera depuis le token JWT
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Utilisateur non authentifié'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('user:read')
            ->toArray();
        
        $data = $this->serializer->serialize($user, 'json', $context);
        $data = json_decode($data, true);

        return $this->json([
            'success' => true,
            'data' => $data
        ]);
    }

    // === RENOUVELLEMENT DE TOKEN ===

    #[Route('/refresh', name: 'refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        // Pour l'instant, on simule
        // Plus tard, on validera le refresh token
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'success' => false,
                'error' => 'Utilisateur non authentifié'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Générer un nouveau token
        $token = $this->generateSimpleJWT($user);

        return $this->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'expires_in' => 3600
            ],
            'message' => 'Token renouvelé'
        ]);
    }

    // === DÉCONNEXION ===

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // En JWT, la déconnexion se fait côté client
        // On peut juste retourner un succès
        return $this->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    // === GÉNÉRATION JWT SIMPLE ===

    private function generateSimpleJWT(User $user): string
    {
        // JWT simple sans bundle pour l'instant
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'iat' => time(),
            'exp' => time() + 3600 // 1 heure
        ]);

        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        // Clé secrète simple (à changer en production)
        $secret = 'your-secret-key-change-in-production';
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $secret, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64Header . "." . $base64Payload . "." . $base64Signature;
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