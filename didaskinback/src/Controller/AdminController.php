<?php

namespace App\Controller;

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

final class AdminController extends AbstractController
{
    #[Route('/admin', name: 'admin_dashboard')]
    #[IsGranted('ROLE_ADMIN')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Bienvenue Dida !',
             'user' => $this->getUser()->getUserIdentifier(),
        ]);
    }

    #[Route('/admin/debug-token', name: 'admin_debug_token')]
    public function debugToken(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        $jwtSecret = $_ENV['JWT_SECRET'] ?? 'NOT_SET';
        
        // Extract token from header
        $token = null;
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }
        
        $tokenInfo = null;
        if ($token) {
            // Try to decode the token manually to see its structure
            $parts = explode('.', $token);
            if (count($parts) === 3) {
                $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0])), true);
                $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
                
                $tokenInfo = [
                    'header' => $header,
                    'payload' => $payload,
                    'is_expired' => isset($payload['exp']) ? $payload['exp'] < time() : 'unknown',
                    'exp_timestamp' => $payload['exp'] ?? 'not_set',
                    'current_timestamp' => time(),
                ];
            }
        }
        
        return $this->json([
            'auth_header' => $authHeader,
            'jwt_secret_set' => $jwtSecret !== 'NOT_SET',
            'jwt_secret_length' => $jwtSecret !== 'NOT_SET' ? strlen($jwtSecret) : 0,
            'user' => $this->getUser() ? $this->getUser()->getUserIdentifier() : 'NOT_AUTHENTICATED',
            'is_authenticated' => $this->getUser() !== null,
            'token_present' => $token !== null,
            'token_info' => $tokenInfo,
        ]);
    }
}
