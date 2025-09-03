<?php
namespace App\Tests\Unit;

use App\Entity\Service;
use App\Entity\SubCategory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ServiceTest extends KernelTestCase
{
    private $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = static::getContainer()->get('validator');
    }

    /**
     * Crée une instance valide de Service
     */
    private function getEntity(): Service
    {
        $subCategory = new SubCategory();
        $subCategory->setLabel('Sous-catégorie Test');

        return (new Service())
            ->setLabel('Service #1')
            ->setShortDescription('Courte description')
            ->setLongDescription('Description longue')
            ->setAdditionalDetails('Détails additionnels')
            ->setServiceDuration(1.5)
            ->setPrice(20.0)
            ->setImageLink('image.jpg')
            ->setSlug('service-1')
            ->setSubCategory($subCategory)
            ->setRanked(1);
    }

    /**
     * Vérifie qu'un Service correctement rempli est valide
     */
    public function testEntityIsValid(): void
    {
        $service = $this->getEntity();

        $errors = $this->validator->validate($service);

        $this->assertCount(
            0,
            $errors,
            'L\'entité Service valide ne devrait pas générer d\'erreurs'
        );
    }

    /**
     * Vérifie qu'un label vide ne provoque pas d'erreur (car pas de contrainte dans l'entité)
     * Si tu ajoutes un @Assert\NotBlank sur label, adapte cette méthode.
     */
    public function testLabelCanBeEmpty(): void
    {
        $service = $this->getEntity();
        $service->setLabel(''); // label vide

        $errors = $this->validator->validate($service);

        $this->assertCount(
            0,
            $errors,
            'Aucune contrainte ne devrait empêcher un label vide dans l\'entité actuelle'
        );
    }
}
