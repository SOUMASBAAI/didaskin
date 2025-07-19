<?php

namespace App\DataFixtures;

use App\Entity\Service;
use App\Entity\User;
use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ServiceFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // Récupération des utilisateurs et catégories depuis les autres fixtures
        $users = $manager->getRepository(User::class)->findAll();
        $categories = $manager->getRepository(Category::class)->findAll();

        // Si pas d'utilisateurs ou de catégories, on crée des références par défaut
        if (empty($users)) {
            throw new \Exception('Aucun utilisateur trouvé. Assurez-vous que UserFixtures est chargé avant ServiceFixtures.');
        }
        
        if (empty($categories)) {
            throw new \Exception('Aucune catégorie trouvée. Assurez-vous que CategoryFixtures est chargé avant ServiceFixtures.');
        }

        $servicesData = [
            [
                'label' => 'Soin Visage Hydratant',
                'description' => 'Soin complet du visage avec nettoyage, gommage et masque hydratant pour tous types de peau',
                'serviceDuration' => 60.0,
                'price' => 65.0,
                'image' => 'soin-visage-hydratant.jpg',
                'slug' => 'soin-visage-hydratant',
                'keywords' => 'soin visage, hydratant, nettoyage, masque, beauté'
            ],
            [
                'label' => 'Soin Anti-Âge Premium',
                'description' => 'Soin anti-âge avec sérum collagène, massage lifting et masque raffermissant',
                'serviceDuration' => 90.0,
                'price' => 120.0,
                'image' => 'soin-anti-age.jpg',
                'slug' => 'soin-anti-age-premium',
                'keywords' => 'anti-âge, collagène, lifting, raffermissant, premium'
            ],
            [
                'label' => 'Nettoyage de Peau Profond',
                'description' => 'Extraction des comédons, purification et traitement des imperfections',
                'serviceDuration' => 75.0,
                'price' => 80.0,
                'image' => 'nettoyage-peau.jpg',
                'slug' => 'nettoyage-peau-profond',
                'keywords' => 'nettoyage, extraction, comédons, purification, acné'
            ],
            [
                'label' => 'Soin Contour des Yeux',
                'description' => 'Traitement spécialisé pour réduire les cernes, poches et rides du contour des yeux',
                'serviceDuration' => 30.0,
                'price' => 45.0,
                'image' => 'contour-yeux.jpg',
                'slug' => 'soin-contour-yeux',
                'keywords' => 'contour yeux, cernes, poches, rides, spécialisé'
            ],
            [
                'label' => 'Manucure Classique',
                'description' => 'Soin complet des mains avec lime, cuticules, massage et pose de vernis',
                'serviceDuration' => 45.0,
                'price' => 35.0,
                'image' => 'manucure-classique.jpg',
                'slug' => 'manucure-classique',
                'keywords' => 'manucure, mains, vernis, cuticules, massage'
            ],
            [
                'label' => 'Manucure Semi-Permanent',
                'description' => 'Manucure avec vernis gel longue tenue, séchage UV inclus',
                'serviceDuration' => 60.0,
                'price' => 50.0,
                'image' => 'manucure-semi-permanent.jpg',
                'slug' => 'manucure-semi-permanent',
                'keywords' => 'manucure, semi-permanent, gel, UV, longue tenue'
            ],
            [
                'label' => 'Soin des Mains Réparateur',
                'description' => 'Traitement intensif pour mains abîmées avec gommage, masque et massage nourrissant',
                'serviceDuration' => 40.0,
                'price' => 40.0,
                'image' => 'soin-mains-reparateur.jpg',
                'slug' => 'soin-mains-reparateur',
                'keywords' => 'soin mains, réparateur, gommage, masque, nourrissant'
            ],
            [
                'label' => 'Peeling Chimique Doux',
                'description' => 'Peeling aux acides de fruits pour renouveler la peau et améliorer l\'éclat du teint',
                'serviceDuration' => 50.0,
                'price' => 90.0,
                'image' => 'peeling-chimique.jpg',
                'slug' => 'peeling-chimique-doux',
                'keywords' => 'peeling, chimique, acides fruits, renouvellement, éclat'
            ]
        ];

        foreach ($servicesData as $index => $serviceData) {
            $service = new Service();
            $service->setLabel($serviceData['label']);
            $service->setDescription($serviceData['description']);
            $service->setServiceDuration($serviceData['serviceDuration']);
            $service->setPrice($serviceData['price']);
            $service->setImage($serviceData['image']);
            $service->setSlug($serviceData['slug']);
            $service->setKeywords($serviceData['keywords']);
            
            // Attribution aléatoire d'un utilisateur et d'une catégorie
            $service->setCreatedBy($users[array_rand($users)]);
            $service->setCategory($categories[array_rand($categories)]);

            $manager->persist($service);
            
            // Création d'une référence pour pouvoir l'utiliser dans d'autres fixtures
            $this->addReference('service_' . $index, $service);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            CategoryFixtures::class,
        ];
    }
}