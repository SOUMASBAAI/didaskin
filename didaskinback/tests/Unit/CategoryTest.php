<?php

namespace App\Tests\Unit;

use App\Entity\Category;
use App\Entity\SubCategory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class CategoryTest extends KernelTestCase
{
    private $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = static::getContainer()->get('validator');
    }

    // Crée une Category valide avec une sous-catégorie
    private function getValidCategory(): Category
    {
        $category = new Category();
        $category->setLabel('Soins du visage')
                 ->setImageLink('soins.jpg')
                 ->setSlug('soins-du-visage')
                 ->setShortDescription('Catégorie dédiée aux soins du visage')
                 ->setRank(1);

        $subCategory = new SubCategory();
        $subCategory->setLabel('Crèmes hydratantes');
        $category->addSubCategory($subCategory);

        return $category;
    }

    // Test qu'une Category valide passe la validation
    public function testCategoryIsValid(): void
    {
        $category = $this->getValidCategory();
        $errors = $this->validator->validate($category);

        $this->assertCount(0, $errors, 'Une catégorie valide ne devrait générer aucune erreur.');
    }

    // Test qu'un label vide déclenche une erreur
    public function testInvalidLabel(): void
    {
        $category = $this->getValidCategory();
        $category->setLabel(''); // label vide

        $errors = $this->validator->validate($category);

        $this->assertGreaterThan(0, count($errors), 'Un label vide devrait déclencher une erreur.');
        $this->assertStringContainsString('Le label ne doit pas être vide', (string) $errors);
    }

    // Test qu'un imageLink vide déclenche une erreur
    public function testInvalidImageLink(): void
    {
        $category = $this->getValidCategory();
        $category->setImageLink('');

        $errors = $this->validator->validate($category);

        $this->assertGreaterThan(0, count($errors), 'Une imageLink vide devrait déclencher une erreur.');
    }

    // Test qu'un slug vide déclenche une erreur
    public function testInvalidSlug(): void
    {
        $category = $this->getValidCategory();
        $category->setSlug('');

        $errors = $this->validator->validate($category);

        $this->assertGreaterThan(0, count($errors), 'Un slug vide devrait déclencher une erreur.');
    }
}
