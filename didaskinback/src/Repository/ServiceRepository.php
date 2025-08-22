<?php

namespace App\Repository;

use App\Entity\Service;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Service>
 */
class ServiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Service::class);
    }
    public function save(Service $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function remove(Service $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function update(Service $entity, array $data): Service
    {
        if(isset($data['label'])) {
            $entity->setLabel($data['label']);
        }
        if(isset($data['shortDescription'])) {
            $entity->setShortDescription($data['shortDescription']);
        }
        if(isset($data['longDescription'])) {
            $entity->setLongDescription($data['longDescription']);
        }
        if(isset($data['additionalDetails'])) {
            $entity->setAdditionalDetails($data['additionalDetails']);
        }
        if(isset($data['serviceDuration'])) {
            $entity->setServiceDuration($data['serviceDuration']);
        }
        if(isset($data['price'])) {
            $entity->setPrice($data['price']);
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
        if(array_key_exists('featuredLanding', $data)) {
            $entity->setFeaturedLanding((bool)$data['featuredLanding']);
        }
        if(array_key_exists('featuredRank', $data)) {
            $entity->setFeaturedRank($data['featuredRank'] !== null ? (int)$data['featuredRank'] : null);
        }

        $this->getEntityManager()->flush();
        return $entity;
    }
    public function findBySubCategoryId(int $subCategoryId): array
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.subCategory = :subCategoryId')
            ->setParameter('subCategoryId', $subCategoryId)
            ->orderBy('s.rank', 'ASC')
            ->getQuery()
            ->getResult();
    }

      public function findAllWithSubcategory(): array
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.subCategory', 'sc')
            ->addSelect('sc')
            ->orderBy('sc.label', 'ASC')
            ->addOrderBy('s.rank', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findFeaturedForLanding(): array
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.featuredLanding = :f')
            ->setParameter('f', true)
            ->orderBy('s.featuredRank', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getNextRankForSubcategory(?int $subCategoryId): int
    {
        $qb = $this->createQueryBuilder('s')
            ->select('MAX(s.rank) as maxRank');
        if ($subCategoryId === null) {
            $qb->andWhere('s.subCategory IS NULL');
        } else {
            $qb->andWhere('s.subCategory = :sid')->setParameter('sid', $subCategoryId);
        }
        $max = (int)($qb->getQuery()->getSingleScalarResult() ?? 0);
        return $max + 1;
    }

    
    

    //    /**
    //     * @return Service[] Returns an array of Service objects
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

    //    public function findOneBySomeField($value): ?Service
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
