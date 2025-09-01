<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class AccessDeniedListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        
        // Handle access denied exceptions
        if ($exception instanceof AccessDeniedException) {
            $response = new JsonResponse([
                'success' => false,
                'error' => 'Access denied',
                'message' => 'You do not have permission to perform this action. Admin role required.',
                'code' => 'ACCESS_DENIED'
            ], 403);
            
            $event->setResponse($response);
            return;
        }
        
        // Handle authentication exceptions
        if ($exception instanceof AuthenticationException) {
            $response = new JsonResponse([
                'success' => false,
                'error' => 'Authentication required',
                'message' => 'You must be logged in to access this resource.',
                'code' => 'AUTHENTICATION_REQUIRED'
            ], 401);
            
            $event->setResponse($response);
            return;
        }
    }
} 