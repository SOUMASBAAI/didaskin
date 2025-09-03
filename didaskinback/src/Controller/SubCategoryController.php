<?php

namespace App\Controller;

use App\Entity\SubCategory;
use App\Entity\Category;
use App\Repository\SubCategoryRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;



#[Route('/subcategories', name: 'app_subcategories')]
class SubCategoryController extends AbstractController
{
    public function __construct(
        private SubCategoryRepository $subCategoryRepository,
        private CategoryRepository $categoryRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private SerializerInterface $serializer
    ) {
    }

    
    

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validate that category exists
        $category = $this->categoryRepository->find($data['category_id'] ?? null);
        if (!$category) {
            return $this->json([
                'success' => false,
                'error' => 'Category not found'
            ], Response::HTTP_BAD_REQUEST);
        }

        $subCategory = new SubCategory();
        $subCategory->setLabel($data['label'] ?? '');
        $subCategory->setImageLink($data['image_link'] ?? '');
        $subCategory->setSlug($data['slug'] ?? '');
        $subCategory->setRank($data['ranked'] ?? 0);
        $subCategory->setCategory($category);

        $errors = $this->validator->validate($subCategory);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'errors' => $this->getErrorsFromValidator($errors),
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($subCategory);
        $this->entityManager->flush();

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('subcategory:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($subCategory, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
            'message' => 'SubCategory created successfully'
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $subCategory = $this->subCategoryRepository->find($id);

        if (!$subCategory) {
            return $this->json([
                'success' => false,
                'error' => 'SubCategory not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('subcategory:read')
            ->toArray();
        
        $data = $this->serializer->serialize($subCategory, 'json', $context);
        $data = json_decode($data, true);

        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $subCategory = $this->subCategoryRepository->find($id);

        if (!$subCategory) {
            return $this->json([
                'success' => false,
                'error' => 'SubCategory not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Update category if provided
        if (isset($data['category_id'])) {
            $category = $this->categoryRepository->find($data['category_id']);
            if (!$category) {
                return $this->json([
                    'success' => false,
                    'error' => 'Category not found'
                ], Response::HTTP_BAD_REQUEST);
            }
            $subCategory->setCategory($category);
        }

        $subCategory = $this->subCategoryRepository->update($subCategory, $data);
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('subcategory:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($subCategory, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
            'message' => 'SubCategory updated successfully'
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $subCategory = $this->subCategoryRepository->find($id);

        if (!$subCategory) {
            return $this->json([
                'success' => false,
                'error' => 'SubCategory not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $this->subCategoryRepository->remove($subCategory, true);

        return $this->json([
            'success' => true,
            'message' => 'SubCategory deleted successfully'
        ]);
    }

    #[Route('/category/{categoryId}', name: 'by_category', methods: ['GET'])]
    public function findByCategory(int $categoryId): JsonResponse
    {
        $subCategories = $this->subCategoryRepository->findByCategoryId($categoryId);
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('subcategory:read')
            ->toArray();
        
        $data = $this->serializer->serialize($subCategories, 'json', $context);
        $data = json_decode($data, true);
       
        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    
    

    
    private function getErrorsFromValidator($errors): array
    {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        return $errorMessages;
    }
} 