<?php

namespace App\Repository;

use App\Entity\SubCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SubCategory>
 */
class SubCategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SubCategory::class);
    }

    public function save(SubCategory $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }

    }

   public function remove(SubCategory $entity, bool $flush = false): void
        {
            $this->getEntityManager()->remove($entity);

            if ($flush) {
                $this->getEntityManager()->flush();
            }
        } 
        
    
        public function update(SubCategory $entity, array $data): SubCategory
        {
            if(isset($data['label'])) {
                $entity->setLabel($data['label']);
            }
            
            if(isset($data['rank'])) {
                $entity->setRank($data['rank']);
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

        public function findByCategoryId(int $categoryId): array
        {
            return $this->createQueryBuilder('s')
                ->andWhere('s.category = :categoryId')
                ->setParameter('categoryId', $categoryId)
                ->orderBy('s.rank', 'ASC')
                ->getQuery()
                ->getResult();
        }



    
    

    //    /**
    //     * @return SubCategory[] Returns an array of SubCategory objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?SubCategory
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
