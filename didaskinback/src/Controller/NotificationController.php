<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/notifications', name: 'notifications_')]
#[IsGranted('ROLE_ADMIN')]
class NotificationController extends AbstractController
{
    public function __construct(private NotificationRepository $repo, private EntityManagerInterface $em) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $user = $this->getUser();
        $qb = $this->repo->createQueryBuilder('n')
            ->leftJoin('n.receiver', 'r')
            ->andWhere('r = :user')
            ->setParameter('user', $user)
            ->orderBy('n.id', 'DESC');
        $items = $qb->getQuery()->getResult();

        $data = array_map(function($n){
            return [
                'id' => $n->getId(),
                'slug' => $n->getSlug(),
                'label' => $n->getLabel(),
                'message' => $n->getMessage(),
                'is_read' => $n->isRead(),
            ];
        }, $items);

        return $this->json(['success' => true, 'data' => $data]);
    }

    #[Route('/read/{id}', name: 'read', methods: ['POST'])]
    public function markRead(int $id): JsonResponse
    {
        $n = $this->repo->find($id);
        if (!$n) return $this->json(['success' => false, 'error' => 'Not found'], Response::HTTP_NOT_FOUND);
        $n->setIsRead(true);
        $this->em->flush();
        return $this->json(['success' => true]);
    }
} 