<?php
namespace App\Tests\Unit;

use App\Entity\Category;
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

    public function getEntity(): Product
    {
        $user = new User();
        $user->setEmail('user@example.com')
             ->setPassword('password123');


        return (new Product())
            ->setLabel('Product #1')
            ->setDescription('Description #1')
            ->setPrice(20.0)
            ->setImage('image.jpg')
            ->setSlug('product-1')
            ->setKeywords('creme,serum')
            ->setCreatedBy($user);
            
    }

    public function testEntityIsValid(): void
    {
        $product = $this->getEntity();

        $errors = $this->validator->validate($product);
        $this->assertCount(0, $errors);
    }

    public function testInvalidLabel(): void
    {
        $product = $this->getEntity();
        $product->setLabel(''); // label vide => invalide

        $errors = $this->validator->validate($product);

        $this->assertGreaterThan(0, count($errors));
        $this->assertStringContainsString('Le label ne doit pas être vide', (string) $errors);
    }
}
