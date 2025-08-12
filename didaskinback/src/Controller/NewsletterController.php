<?php

namespace App\Controller;

use App\Entity\Newsletter;
use App\Repository\NewsletterRepository;
use App\Service\EmailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Psr\Log\LoggerInterface;


#[Route('/newsletters', name: 'app_newsletters')]
class NewsletterController extends AbstractController
{
    
         public function __construct(
        private NewsletterRepository $newsletterRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private EmailService $emailService,
        private LoggerInterface $logger
    ) {}

     #[Route('/newsletter', name: 'list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $newsletters = $this->newsletterRepository->findNewsletters();
       
        return $this->json ([
            'success' => true,
            'data' => $newsletters,
        ]);
    }
    
     #[Route('/new', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $newsletter = new Newsletter();
        $newsletter->setLabel($data['label'] ?? '');
        $newsletter->setShortDescription($data['shortDescription'] ?? '');
        $newsletter->setActionCall($data['actionCall'] ?? '');
        $newsletter->setUrl($data['url'] ?? '');
        $newsletter->setImageLink($data['image_link'] ?? '');
        $newsletter->setContent($data['content'] ?? '');
        $newsletter->setStatus($data['status'] ?? Newsletter::STATUS_DRAFT);

        $errors= $this->validator->validate($newsletter);
        if (count($errors) > 0) {
            return $this->json(
                [
                    'success' => false,
                    'errors' => $this->getErrorsFromValidator($errors),
                ],
                Response::HTTP_BAD_REQUEST
            );

        }
        $this->entityManager->persist($newsletter);
        $this->entityManager->flush();

        // If newsletter is published, send it to subscribers
        $emailResult = null;
        if ($newsletter->getStatus() === Newsletter::STATUS_PUBLISHED) {
            $emailResult = $this->emailService->sendNewsletterToSubscribers($newsletter);
            $this->logger->info('Newsletter published and sent', [
                'newsletter_id' => $newsletter->getId(),
                'email_result' => $emailResult
            ]);
        }

        $response = [
            'success' => true,
            'data' => $newsletter,
            'message' => 'Newsletter créée avec succès'
        ];

        if ($emailResult) {
            $response['email_sent'] = $emailResult;
        }

        return $this->json($response, Response::HTTP_CREATED);
    }

      #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $newsletter = $this->newsletterRepository->find($id);

        if (!$newsletter) {
            return $this->json(['error' => 'Newsletter introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $newsletter,
        ]);
    }

     #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newsletter = $this->newsletterRepository->find($id);

        if (!$newsletter) {
            return $this->json(['error' => 'Newsletter introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Check if status is being changed to published
        $wasPublished = $newsletter->getStatus() === Newsletter::STATUS_PUBLISHED;
        $newsletter = $this->newsletterRepository->update($newsletter, $data);
        $isNowPublished = $newsletter->getStatus() === Newsletter::STATUS_PUBLISHED;

        // If newsletter was not published before but is now published, send emails
        $emailResult = null;
        if (!$wasPublished && $isNowPublished) {
            $emailResult = $this->emailService->sendNewsletterToSubscribers($newsletter);
            $this->logger->info('Newsletter status changed to published and sent', [
                'newsletter_id' => $newsletter->getId(),
                'email_result' => $emailResult
            ]);
        }
        
        $response = [
            'success' => true,
            'data' => $newsletter,
            'message' => 'Newsletter mise à jour avec succès'
        ];

        if ($emailResult) {
            $response['email_sent'] = $emailResult;
        }

        return $this->json($response);
    }

    #[Route('/{id}/send', name: 'send_newsletter', methods: ['POST'])]
    public function sendNewsletter(int $id): JsonResponse
    {
        $newsletter = $this->newsletterRepository->find($id);

        if (!$newsletter) {
            return $this->json(['error' => 'Newsletter introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Send newsletter to subscribers
        $emailResult = $this->emailService->sendNewsletterToSubscribers($newsletter);
        
        $this->logger->info('Newsletter manually sent', [
            'newsletter_id' => $newsletter->getId(),
            'email_result' => $emailResult
        ]);

        return $this->json([
            'success' => true,
            'data' => $newsletter,
            'email_sent' => $emailResult,
            'message' => 'Newsletter envoyée avec succès'
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $newsletter = $this->newsletterRepository->find($id);

        if (!$newsletter) {
            return $this->json(['error' => 'Newsletter introuvable'], Response::HTTP_NOT_FOUND);
        }

        $this->newsletterRepository->remove($newsletter, true);

        return $this->json([
            'success' => true,
            'message' => 'Newsetter supprimée avec succès'
        ]);
    }
    private function getErrorsFromValidator($errors): array
    {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = 
               
               $error->getMessage();
            
        }
        return $errorMessages;
    }

    

}