<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


#[Route('/products', name: 'app_products')]
class ProductController extends AbstractController
{
    public function __construct(
        private ProductRepository $productRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {}

    #[Route('/products', name: 'product_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $products = $this->productRepository->findProducts();
        return $this->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    #[Route('/products', name: 'product_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $product = new Product();
        $product->setLabel($data['label'] ?? '');
        $product->setShortDescription($data['shortDescription'] ?? '');
        $product->setLongDescription($data['longDescription'] ?? '');
        $product->setAdditionalDetails($data['additionalDetails'] ?? '');
        $product->setPrice($data['price'] ?? 0);
        $product->setRank($data['rank'] ?? 0);
        $product->setImage_link($data['image_link'] ?? '');
        $product->setStockQuantity($data['stock_quantity'] ?? '');
        $product->setSlug($data['slug'] ?? '');

        $errors = $this->validator->validate($product);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'errors' => $this->getErrorsFromValidator($errors),
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'data' => $product,
            'message' => 'Produit ajouté avec succès'
        ], Response::HTTP_CREATED);
    }

    #[Route('/products/{id}', name: 'product_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    #[Route('/products/{id}', name: 'product_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit introuvable'], Response::HTTP_NOT_FOUND);
        }

        $product = $this->productRepository->update($product, $data);

        return $this->json([
            'success' => true,
            'data' => $product,
            'message' => 'Produit modifié avec succès'
        ]);
    }

    #[Route('/products/{id}', name: 'product_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit introuvable'], Response::HTTP_NOT_FOUND);
        }

        $this->productRepository->remove($product, true);

        return $this->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès'
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
