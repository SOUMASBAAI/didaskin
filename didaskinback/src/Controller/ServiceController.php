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

    

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validate that subcategory exists
        $subCategory = $this->subCategoryRepository->find($data['subcategory_id'] ?? null);
        if (!$subCategory) {
            return $this->json([
                'success' => false,
                'error' => 'SubCategory not found'
            ], Response::HTTP_BAD_REQUEST);
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
        $service->setRank($data['rank'] ?? 0);
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

    #[Route('/{id}', name: 'show', methods: ['GET'])]
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

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
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

        // Update subcategory if provided
        if (isset($data['subcategory_id'])) {
            $subCategory = $this->subCategoryRepository->find($data['subcategory_id']);
            if (!$subCategory) {
                return $this->json([
                    'success' => false,
                    'error' => 'SubCategory not found'
                ], Response::HTTP_BAD_REQUEST);
            }
            $service->setSubCategory($subCategory);
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

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
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

    

    private function getErrorsFromValidator($errors): array
    {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        return $errorMessages;
    }
} 