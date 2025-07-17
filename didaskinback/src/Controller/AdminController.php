<?php

namespace App\Controller;

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

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
}
