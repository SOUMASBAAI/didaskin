<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    public function save(Category $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager->flush();
        }
    }
    public function remove(Category $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findCategories():array
    {
        return $this->createQueryBuilder('c')
            ->orderBy('c.ranked', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function update(Category $entity, array $data): Category
    {
       
        if(isset($data['label'])) {
            $entity->setLabel($data['label']);
        }
        if(isset($data['shortDescription'])) {
            $entity->setShortDescription($data['shortDescription']);
        }
        if(isset($data['ranked'])) {
            $entity->setRank($data['ranked']);
        }
        if(isset($data['image_link'])) {
            $entity->setImageLink($data['image_link']);
        }
        if(isset($data['slug'])) {
            $entity->setSlug($data['slug']);
        }

        
        $this->getEntityManager()->flush();
        return $entity;
    }

    public function findById(int $id): ?Category
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }


    //    /**
    //     * @return Category[] Returns an array of Category objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Category
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
