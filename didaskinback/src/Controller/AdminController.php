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

    #[Route('/admin/test-no-auth', name: 'admin_test_no_auth')]
    public function testNoAuth(): JsonResponse
    {
        $jwtSecret = $_ENV['JWT_SECRET'] ?? 'NOT_SET';
        
        return $this->json([
            'message' => 'This endpoint works without authentication',
            'timestamp' => time(),
            'jwt_secret_configured' => $jwtSecret !== 'NOT_SET',
            'jwt_secret_length' => strlen($jwtSecret),
            'jwt_secret_preview' => $jwtSecret !== 'NOT_SET' ? substr($jwtSecret, 0, 8) . '...' : 'NOT_SET',
        ]);
    }

    #[Route('/admin/validate-token', name: 'admin_validate_token')]
    public function validateToken(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->json(['error' => 'No token provided'], 401);
        }
        
        $token = substr($authHeader, 7);
        $jwtSecret = $_ENV['JWT_SECRET'] ?? 'DidaskinSecureJWT2024ProductionKey789ABC123XYZ456DEF';
        
        try {
            // Manually validate the token
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return $this->json(['error' => 'Invalid token format'], 401);
            }
            
            $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0])), true);
            $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
            
            // Verify signature
            $expectedSignature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], $jwtSecret, true);
            $expectedBase64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($expectedSignature));
            
            if ($parts[2] !== $expectedBase64Signature) {
                return $this->json([
                    'error' => 'Invalid signature',
                    'expected_sig_preview' => substr($expectedBase64Signature, 0, 10) . '...',
                    'actual_sig_preview' => substr($parts[2], 0, 10) . '...',
                    'secret_used_length' => strlen($jwtSecret)
                ], 401);
            }
            
            // Check expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return $this->json(['error' => 'Token expired'], 401);
            }
            
            return $this->json([
                'success' => true,
                'message' => 'Token is valid!',
                'payload' => $payload,
                'header' => $header
            ]);
            
        } catch (\Exception $e) {
            return $this->json(['error' => 'Token validation failed: ' . $e->getMessage()], 401);
        }
    }
}
