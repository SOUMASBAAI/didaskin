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
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class SubscriptionController extends AbstractController
{
	public function __construct(
		private readonly EntityManagerInterface $em,
		private readonly UserRepository $users
	) {}

	#[Route('/subscribe', name: 'public_subscribe', methods: ['POST'])]
	public function subscribe(Request $request): JsonResponse
	{
		$data = json_decode($request->getContent(), true) ?? [];
		$email = trim((string)($data['email'] ?? ''));
		$firstName = trim((string)($data['firstName'] ?? ''));
		$lastName = trim((string)($data['lastName'] ?? ''));
		$phoneNumber = trim((string)($data['phoneNumber'] ?? ''));

		if ($email === '' || $firstName === '' || $lastName === '' || $phoneNumber === '') {
			return $this->json([
				'success' => false,
				'error' => 'Les champs email, prénom, nom et téléphone sont requis',
			], Response::HTTP_BAD_REQUEST);
		}

		$user = $this->users->findByEmail($email);
		$created = false;

		if (!$user) {
			$user = new User();
			$user->setEmail($email)
				->setFirstName($firstName)
				->setLastName($lastName)
				->setPhoneNumber($phoneNumber)
				->setRole('ROLE_USER')
				->setPassword('temporary_password_' . uniqid())
				->setCreatedAt(new \DateTimeImmutable());
			$created = true;
			$this->em->persist($user);
		} else {
			// Optionally refresh basic info
			$user->setFirstName($firstName);
			$user->setLastName($lastName);
			$user->setPhoneNumber($phoneNumber);
		}

		// Mark subscribed
		$user->setIsSubscribed(true);
		$user->setUpdatedAt(new \DateTimeImmutable());
		$this->em->flush();

		// Notify admins
		$admins = $this->users->findByRole('ROLE_ADMIN');
		if (!empty($admins)) {
			$notification = (new Notification())
				->setSlug('newsletter_subscribe')
				->setLabel('Nouvelle inscription newsletter')
				->setMessage(sprintf('%s %s s\'est inscrit(e) à la newsletter', $user->getFirstName(), $user->getLastName()))
				->setIsRead(false);
			foreach ($admins as $admin) {
				$notification->addReceiver($admin);
			}
			$this->em->persist($notification);
			$this->em->flush();
		}

		return $this->json([
			'success' => true,
			'message' => $created ? 'Inscription réussie' : 'Abonnement mis à jour',
		]);
	}

	#[Route('/unsubscribe', name: 'public_unsubscribe', methods: ['GET'])]
	public function unsubscribe(Request $request): RedirectResponse
	{
		$userId = (int) $request->query->get('u', 0);
		$token = (string) $request->query->get('t', '');
		$frontendBase = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';

		if ($userId <= 0 || $token === '') {
			$errorUrl = sprintf('%s/unsubscribe?status=error&message=%s', 
				rtrim($frontendBase, '/'), 
				urlencode('Lien de désabonnement invalide')
			);
			return new RedirectResponse($errorUrl);
		}

		$user = $this->users->find($userId);
		if (!$user) {
			$errorUrl = sprintf('%s/unsubscribe?status=error&message=%s', 
				rtrim($frontendBase, '/'), 
				urlencode('Utilisateur non trouvé')
			);
			return new RedirectResponse($errorUrl);
		}

		// Verify token
		$secret = $_ENV['APP_SECRET'] ?? 'app-secret';
		$expectedToken = hash_hmac('sha256', $user->getId() . '|' . $user->getEmail(), $secret);
		
		if (!hash_equals($expectedToken, $token)) {
			$errorUrl = sprintf('%s/unsubscribe?status=error&message=%s', 
				rtrim($frontendBase, '/'), 
				urlencode('Token de sécurité invalide')
			);
			return new RedirectResponse($errorUrl);
		}

		// Unsubscribe user
		$user->setIsSubscribed(false);
		$user->setUpdatedAt(new \DateTimeImmutable());
		$this->em->flush();

		$successUrl = sprintf('%s/unsubscribe?status=success&firstName=%s&lastName=%s&email=%s', 
			rtrim($frontendBase, '/'),
			urlencode($user->getFirstName()),
			urlencode($user->getLastName()),
			urlencode($user->getEmail())
		);
		
		return new RedirectResponse($successUrl);
	}
} 