<?php

namespace App\Controller;

use App\Entity\Service;
use App\Entity\SubCategory;
use App\Repository\ServiceRepository;
use App\Repository\SubCategoryRepository;
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

#[Route('/services', name: 'app_services')]
class ServiceController extends AbstractController
{
    public function __construct(
        private ServiceRepository $serviceRepository,
        private SubCategoryRepository $subCategoryRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private SerializerInterface $serializer
    ) {
    }

        #[Route('/all', name: 'list_all', methods: ['GET'])]
    public function listAll(): JsonResponse
    {
        $services = $this->serviceRepository->findAllWithSubcategory();
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('service:read')
            ->toArray();
        
        $data = $this->serializer->serialize($services, 'json', $context);
        $data = json_decode($data, true);
       
        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $subCategory = null;
        if (isset($data['subcategory_id'])) {
            if ($data['subcategory_id'] !== null && $data['subcategory_id'] !== '') {
                $subCategory = $this->subCategoryRepository->find($data['subcategory_id']);
                if (!$subCategory) {
                    return $this->json([
                        'success' => false,
                        'error' => 'SubCategory not found'
                    ], Response::HTTP_BAD_REQUEST);
                }
            }
        }

        $service = new Service();
        $service->setLabel($data['label'] ?? '');
        $service->setShortDescription($data['shortDescription'] ?? '');
        $service->setLongDescription($data['longDescription'] ?? '');
        $service->setAdditionalDetails($data['additionalDetails'] ?? '');
        $service->setServiceDuration($data['serviceDuration'] ?? 0);
        $service->setPrice($data['price'] ?? 0);
        $service->setImageLink($data['image_link'] ?? '');
        $service->setSlug($data['slug'] ?? '');
        // Auto-assign rank to last position within the same subcategory (or null group)
        $nextRank = $this->serviceRepository->getNextRankForSubcategory($subCategory?->getId());
        $service->setRank($nextRank);
        if (array_key_exists('featuredLanding', $data)) {
            $service->setFeaturedLanding((bool)$data['featuredLanding']);
        }
        if (array_key_exists('featuredRank', $data)) {
            $service->setFeaturedRank($data['featuredRank'] !== null ? (int)$data['featuredRank'] : null);
        }
        $service->setSubCategory($subCategory);

        $errors = $this->validator->validate($service);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'errors' => $this->getErrorsFromValidator($errors),
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($service);
        $this->entityManager->flush();

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('service:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($service, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
            'message' => 'Service created successfully'
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'], requirements: ['id' => '\\d+'])]
    public function show(int $id): JsonResponse
    {
        $service = $this->serviceRepository->find($id);

        if (!$service) {
            return $this->json([
                'success' => false,
                'error' => 'Service not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('service:read')
            ->toArray();
        
        $data = $this->serializer->serialize($service, 'json', $context);
        $data = json_decode($data, true);

        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'], requirements: ['id' => '\\d+'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $service = $this->serviceRepository->find($id);

        if (!$service) {
            return $this->json([
                'success' => false,
                'error' => 'Service not found'
            ], Response::HTTP_NOT_FOUND);
        }

        if (array_key_exists('subcategory_id', $data)) {
            if ($data['subcategory_id'] === null || $data['subcategory_id'] === '') {
                $service->setSubCategory(null);
            } else {
                $subCategory = $this->subCategoryRepository->find($data['subcategory_id']);
                if (!$subCategory) {
                    return $this->json([
                        'success' => false,
                        'error' => 'SubCategory not found'
                    ], Response::HTTP_BAD_REQUEST);
                }
                $service->setSubCategory($subCategory);
            }
        }

        $service = $this->serviceRepository->update($service, $data);
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('service:read')
            ->toArray();
        
        $serializedData = $this->serializer->serialize($service, 'json', $context);
        $serializedData = json_decode($serializedData, true);

        return $this->json([
            'success' => true,
            'data' => $serializedData,
            'message' => 'Service updated successfully'
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'], requirements: ['id' => '\\d+'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $service = $this->serviceRepository->find($id);

        if (!$service) {
            return $this->json([
                'success' => false,
                'error' => 'Service not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $this->serviceRepository->remove($service, true);

        return $this->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }

    #[Route('/subcategory/{subcategoryId}', name: 'by_subcategory', methods: ['GET'])]
    public function findBySubCategory(int $subcategoryId): JsonResponse
    {
        $services = $this->serviceRepository->findBySubCategoryId($subcategoryId);
        
        $context = (new ObjectNormalizerContextBuilder())
            ->withGroups('service:read')
            ->toArray();
        
        $data = $this->serializer->serialize($services, 'json', $context);
        $data = json_decode($data, true);
       
        return $this->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    #[Route('/featured', name: 'featured', methods: ['GET'])]
    public function featured(): JsonResponse
    {
        try {
            $services = $this->serviceRepository->findFeaturedForLanding();
            $data = array_map(function ($s) {
                return [
                    'id' => $s->getId(),
                    'label' => $s->getLabel(),
                    'price' => $s->getPrice(),
                    'image_link' => $s->getImageLink(),
                    'featuredRank' => $s->getFeaturedRank(),
                ];
            }, $services);
            return $this->json(['success' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            // Fallback to raw SQL to bypass ORM mapping issues
            try {
                $conn = $this->entityManager->getConnection();
                // Check if the featured columns exist; if not, return empty list gracefully
                try {
                    $schemaManager = method_exists($conn, 'createSchemaManager')
                        ? $conn->createSchemaManager()
                        : $conn->getSchemaManager();
                    $columns = $schemaManager->listTableColumns('service');
                    $hasFeaturedLanding = isset($columns['featured_landing']);
                    $hasFeaturedRank = isset($columns['featured_rank']);
                    if (!$hasFeaturedLanding || !$hasFeaturedRank) {
                        return $this->json(['success' => true, 'data' => [], 'note' => 'featured columns missing']);
                    }
                } catch (\Throwable $_) {
                    // If schema check itself fails, still attempt query, and handle below
                }
                $rows = $conn->executeQuery(
                    'SELECT id, label, price, image_link, featured_rank FROM service WHERE featured_landing = 1 ORDER BY featured_rank ASC'
                )->fetchAllAssociative();
                return $this->json(['success' => true, 'data' => $rows, 'fallback' => true]);
            } catch (\Throwable $inner) {
                // Last resort: never 500, return empty list with diagnostic note
                return $this->json([
                    'success' => true,
                    'data' => [],
                    'note' => 'featured fetch failed: ' . $inner->getMessage(),
                ]);
            }
        }
    }

    #[Route('/featured/reorder', name: 'featured_reorder', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function reorderFeatured(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $ids = $payload['ids'] ?? [];
        if (!is_array($ids) || empty($ids)) {
            return $this->json(['success' => false, 'error' => 'Invalid ids'], Response::HTTP_BAD_REQUEST);
        }
        $rank = 1;
        foreach ($ids as $id) {
            $svc = $this->serviceRepository->find($id);
            if ($svc && $svc->isFeaturedLanding()) {
                $svc->setFeaturedRank($rank++);
            }
        }
        $this->entityManager->flush();
        return $this->json(['success' => true]);
    }

    #[Route('/reorder', name: 'reorder', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function reorder(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $ids = $payload['ids'] ?? [];
        if (!is_array($ids) || empty($ids)) {
            return $this->json(['success' => false, 'error' => 'Invalid ids'], Response::HTTP_BAD_REQUEST);
        }
        $rank = 1;
        foreach ($ids as $id) {
            $svc = $this->serviceRepository->find($id);
            if ($svc) {
                $svc->setRank($rank++);
            }
        }
        $this->entityManager->flush();
        return $this->json(['success' => true]);
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