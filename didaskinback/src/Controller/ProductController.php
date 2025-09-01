<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/products', name: 'app_products')]
class ProductController extends AbstractController
{
    public function __construct(
        private ProductRepository $productRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'product_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $products = $this->productRepository->findProducts();
        return $this->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    #[Route('', name: 'product_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $product = new Product();
        $product->setLabel($data['label'] ?? '');
        $product->setShortDescription($data['shortDescription'] ?? '');
        $product->setLongDescription($data['longDescription'] ?? '');
        $product->setAdditionalDetails($data['additionalDetails'] ?? '');
        $product->setPrice($data['price'] ?? 0);
        // Auto rank to last
        $product->setRank($this->productRepository->getNextRank());
        $product->setImageLink($data['image_link'] ?? '');
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

    #[Route('/{id}', name: 'product_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Return the same data structure as the index method
        $productData = [
            'id' => $product->getId(),
            'label' => $product->getLabel(),
            'price' => $product->getPrice(),
            'stock_quantity' => $product->getStockQuantity(),
            'slug' => $product->getSlug(),
            'shortDescription' => $product->getShortDescription(),
            'longDescription' => $product->getLongDescription(),
            'AdditionalDetails' => $product->getAdditionalDetails(),
            'rank' => $product->getRank(),
            'image_link' => $product->getImageLink(),
        ];

        return $this->json([
            'success' => true,
            'data' => $productData,
        ]);
    }

    #[Route('/{id}', name: 'product_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Mettre à jour les propriétés du produit
        if (isset($data['label'])) {
            $product->setLabel($data['label']);
        }
        if (isset($data['shortDescription'])) {
            $product->setShortDescription($data['shortDescription']);
        }
        if (isset($data['longDescription'])) {
            $product->setLongDescription($data['longDescription']);
        }
        if (isset($data['additionalDetails'])) {
            $product->setAdditionalDetails($data['additionalDetails']);
        }
        if (array_key_exists('price', $data) && $data['price'] !== null && $data['price'] !== '') {
            $product->setPrice((float) $data['price']);
        }
        if (isset($data['rank'])) {
            $product->setRank($data['rank']);
        }
        if (isset($data['image_link'])) {
            $product->setImageLink($data['image_link']);
        }
        if (array_key_exists('stock_quantity', $data) && $data['stock_quantity'] !== null && $data['stock_quantity'] !== '') {
            $product->setStockQuantity((int) $data['stock_quantity']);
        }
        if (isset($data['slug'])) {
            $product->setSlug($data['slug']);
        }

        // Valider l'entité
        $errors = $this->validator->validate($product);
        if (count($errors) > 0) {
            return $this->json([
                'success' => false,
                'errors' => $this->getErrorsFromValidator($errors),
            ], Response::HTTP_BAD_REQUEST);
        }

        // Persister les modifications
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'data' => $product,
            'message' => 'Produit modifié avec succès'
        ]);
    }

    #[Route('/{id}', name: 'product_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
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

    #[Route('/reorder', name: 'product_reorder', methods: ['POST'])]
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
            $prod = $this->productRepository->find($id);
            if ($prod) {
                $prod->setRank($rank++);
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
