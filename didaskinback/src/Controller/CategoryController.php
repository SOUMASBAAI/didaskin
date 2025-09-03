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
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Context\Normalizer\ObjectNormalizerContextBuilder;
use Symfony\Component\Security\Http\Attribute\IsGranted;


#[Route('/categories', name: 'app_categories')]
class CategoryController extends AbstractController

{   public function __construct(
    private CategoryRepository $categoryRepository,
    private EntityManagerInterface $entityManager,
    private ValidatorInterface $validator,
    private SerializerInterface $serializer
    )
        
    {
 
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function index(): JsonResponse


    {
        $categories = $this->categoryRepository->findCategories();
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('category:read')
            ->toArray();
        
        $data = $this->serializer->serialize($categories, 'json', $context);
        $data = json_decode($data, true);
       
        return $this->json ([
            'success' => true,
            'data' => $data,
        ]);
    }

     #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $category = new Category();
        $category->setLabel($data['label'] ?? '');
        $category->setShortDescription($data['shortDescription'] ?? '');
        // Assign last ranked automatically
        $maxRank = (int)($this->categoryRepository->createQueryBuilder('c')
            ->select('MAX(c.ranked)')
            ->getQuery()
            ->getSingleScalarResult() ?? 0);
        $category->setRank($maxRank + 1);
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

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('category:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($category, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
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

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('category:read')
            ->toArray();
        
        $data = $this->serializer->serialize($category, 'json', $context);
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
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return $this->json(['error' => 'Categorie introuvable'], Response::HTTP_NOT_FOUND);
        }

        $category = $this->categoryRepository->update($category, $data);
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('category:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($category, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
            'message' => 'Categorie mise à jour avec succès'
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
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

    #[Route('/reorder', name: 'reorder', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function reorder(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ids = $data['ids'] ?? [];
        if (!is_array($ids) || empty($ids)) {
            return $this->json(['success' => false, 'error' => 'Liste invalide'], Response::HTTP_BAD_REQUEST);
        }
        // Reassign ranked based on provided order (1-based)
        foreach ($ids as $index => $id) {
            $cat = $this->categoryRepository->find($id);
            if ($cat) {
                $cat->setRank($index + 1);
            }
        }
        $this->entityManager->flush();
        return $this->json(['success' => true]);
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
