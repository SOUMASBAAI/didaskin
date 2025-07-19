<?php
namespace App\Tests\Unit;

use App\Entity\Category;
use App\Entity\Service;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ServiceTest extends KernelTestCase
{
    private $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = static::getContainer()->get('validator');
    }

    public function getEntity(): Service
    {
        $user = new User();
        $user->setEmail('user@example.com')
             ->setPassword('password123');

        $category = new Category();
        $category->setLabel('Catégorie Test');

        return (new Service())
            ->setLabel('Service #1')
            ->setDescription('Description #1')
            ->setServiceDuration(1.5)
            ->setPrice(20.0)
            ->setImage('image.jpg')
            ->setSlug('service-1')
            ->setKeywords('soin,beauté')
            ->setCreatedBy($user)
            ->setCategory($category);
    }

    public function testEntityIsValid(): void
    {
        $service = $this->getEntity();

        $errors = $this->validator->validate($service);
        $this->assertCount(0, $errors);
    }

    public function testInvalidLabel(): void
    {
        $service = $this->getEntity();
        $service->setLabel(''); // label vide => invalide

        $errors = $this->validator->validate($service);

        $this->assertGreaterThan(0, count($errors));
        $this->assertStringContainsString('Le label ne doit pas être vide', (string) $errors);
    }
}
