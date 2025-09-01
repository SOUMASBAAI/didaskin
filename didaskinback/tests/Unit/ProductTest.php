<?php

namespace App\Tests\Unit;

use App\Entity\Product;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductTest extends KernelTestCase
{
    private $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = static::getContainer()->get('validator');
    }

    /**
     * Crée un produit valide pour les tests
     */
    public function getEntity(): Product
    {
        $user = new User();
        $user->setEmail('user@example.com')
             ->setPassword('password123');

        return (new Product())
            ->setLabel('Produit Test')
            ->setPrice(20.0)
            ->setImageLink('image.jpg')
            ->setStockQuantity(10)
            ->setSlug('produit-test')
            ->setShortDescription('Description courte')
            ->setLongDescription('Description longue')
            ->setAdditionalDetails('Détails supplémentaires')
            ->setRank(1);
            // ->setCreatedBy($user); // si tu n’as pas de relation User dans ton entity, tu peux retirer
    }

    /**
     * Test que le produit est valide
     */
    public function testEntityIsValid(): void
    {
        $product = $this->getEntity();

        $errors = $this->validator->validate($product);
        $this->assertCount(0, $errors);
    }

    /**
     * Test qu’un label vide est invalide
     */
    public function testInvalidLabel(): void
    {
        $product = $this->getEntity();
        $product->setLabel(''); // label vide => invalide

        $errors = $this->validator->validate($product);

        $this->assertGreaterThan(0, count($errors));
        $this->assertStringContainsString('Le label ne doit pas être vide', (string) $errors);
    }
}
