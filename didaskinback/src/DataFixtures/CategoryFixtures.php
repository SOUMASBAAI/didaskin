<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\User; // <-- Assurez-vous que cette ligne est présente
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class CategoryFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $categoriesData = [
            [
                'label' => 'Soins du Visage',
                'image' => 'category-soins-visage.jpg',
                'slug' => 'soins-du-visage',
                'relation' => 'visage'
            ],
            [
                'label' => 'Soins des Mains',
                'image' => 'category-soins-mains.jpg',
                'slug' => 'soins-des-mains',
                'relation' => 'mains'
            ],
            [
                'label' => 'Traitements Spécialisés',
                'image' => 'category-traitements-specialises.jpg',
                'slug' => 'traitements-specialises',
                'relation' => 'specialise'
            ],
            [
                'label' => 'Soins Express',
                'image' => 'category-soins-express.jpg',
                'slug' => 'soins-express',
                'relation' => 'express'
            ]
        ];

        /** @var User $admin */ // <-- Cette annotation aide l'IDE, mais n'est pas obligatoire pour l'exécution
        $admin = $this->getReference('user-admin', User::class);

        foreach ($categoriesData as $index => $categoryData) {
            $category = new Category();
            $category->setLabel($categoryData['label']);
            $category->setImage($categoryData['image']);
            $category->setSlug($categoryData['slug']);
           
            
            // Créateur : l’admin
            $category->setCreatedBy($admin);

            $manager->persist($category);
            
            $this->addReference('category_' . $index, $category);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class, // <-- Cette dépendance est cruciale
        ];
    }
}