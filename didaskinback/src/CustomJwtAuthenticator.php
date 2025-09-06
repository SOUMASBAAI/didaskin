<?php

namespace App;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class CustomJwtAuthenticator extends AbstractAuthenticator
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): Passport
    {
        $authorizationHeader = $request->headers->get('Authorization');

        if (null === $authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            throw new CustomUserMessageAuthenticationException('No API token provided');
        }

        $token = substr($authorizationHeader, 7);

        try {
            $payload = $this->validateJwtToken($token);
            
            if (!isset($payload['email'])) {
                throw new CustomUserMessageAuthenticationException('Invalid token format');
            }

            return new SelfValidatingPassport(
                new UserBadge($payload['email'], function($userIdentifier) {
                    return $this->userRepository->findByEmail($userIdentifier);
                })
            );

        } catch (\Exception $e) {
            throw new CustomUserMessageAuthenticationException('Invalid JWT Token');
        }
    }

    private function validateJwtToken(string $token): array
    {
        $jwtSecret = $_ENV['JWT_SECRET'] ?? 'DidaskinSecureJWT2024ProductionKey789ABC123XYZ456DEF';
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new \Exception('Invalid token format');
        }

        // Decode header and payload
        $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0])), true);
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);

        if (!$header || !$payload) {
            throw new \Exception('Invalid token data');
        }

        // Verify signature
        $expectedSignature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], $jwtSecret, true);
        $expectedBase64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));

        if ($parts[2] !== $expectedBase64Signature) {
            throw new \Exception('Invalid signature');
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new \Exception('Token expired');
        }

        return $payload;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'code' => 401,
            'message' => 'Authentication failed: ' . $exception->getMessageKey()
        ], Response::HTTP_UNAUTHORIZED);
    }
}
