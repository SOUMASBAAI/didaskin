<?php

namespace App\Controller;

use App\Entity\Newsletter;
use App\Repository\NewsletterRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


#[Route('/newsletters', name: 'app_newsletters')]
class NewsletterController extends AbstractController
{
    
         public function __construct(
        private NewsletterRepository $newsletterRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
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
        $newsletter->setStatus($data['status'] ?? 0);

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

        return $this->json([
            'success' => true,
            'data' => $newsletter,
            'message' => 'Newsletter créée avec succès'
        ], Response::HTTP_CREATED);
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

        $newsletter = $this->newsletterRepository->update($newsletter, $data);
        
        return $this->json([
            'success' => true,
            'data' => $newsletter,
            'message' => 'Categorie mise à jour avec succès'
        ]);
    }
      #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $newsletter = $this->newsletterRepository->find($id);

        if (!$newsletter) {
            return $this->json(['error' => 'Categorie introuvable'], Response::HTTP_NOT_FOUND);
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