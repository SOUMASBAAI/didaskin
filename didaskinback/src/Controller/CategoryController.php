<?php

namespace App\Controller;

use PHPUnit\Util\Json;
use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validator\ValidatorInterface;


#[Route('/categories', name: 'app_categories')]
class CategoryController extends AbstractController

{   public function __construct(private CategoryRepository $categoryRepository,
    private EntityManagerInterface $entityManager,private ValidatorInterface $validator)
        
    {
 
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function index(): JsonResponse


    {
        $categories = $this->categoryRepository->findCategories();
       
        return $this->json ([
            'success' => true,
            'data' => $categories,
        ]);
    }

     #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $category = new Category();
        $category->setLabel($data['label'] ?? '');
        $category->setShortDescription($data['shortDescription'] ?? '');
        $category->setRank($data['rank'] ?? 0);
        $category->setImageLink($data['image_link'] ?? '');
        $category->setSlug($data['slug'] ?? '');

        $errors= $this->validator->validate($category);
        if (count($errors) > 0) {
            return $this->json(
                [
                    'success' => false,
                    'errors' => $this->getErrorsFromValidator($errors),
                ],
                Response::HTTP_BAD_REQUEST
            );

        }
        $this->entityManager->persist($category);
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'data' => $category,
            'message' => 'Categorie créée avec succès'
        ], Response::HTTP_CREATED);
    }


    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return $this->json(['error' => 'Categorie introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return $this->json(['error' => 'Categorie introuvable'], Response::HTTP_NOT_FOUND);
        }

        $category = $this->categoryRepository->update($category, $data);
        
        return $this->json([
            'success' => true,
            'data' => $category,
            'message' => 'Categorie mise à jour avec succès'
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return $this->json(['error' => 'Categorie introuvable'], Response::HTTP_NOT_FOUND);
        }

        $this->categoryRepository->remove($category, true);

        return $this->json([
            'success' => true,
            'message' => 'Categorie supprimée avec succès'
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
