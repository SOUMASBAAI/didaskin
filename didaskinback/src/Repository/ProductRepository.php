<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }
     public function save(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function remove(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

     public function findProducts():array
    {
        return $this->createQueryBuilder('p')
            ->select('p.id, p.label, p.price, p.stock_quantity, p.slug, p.shortDescription, p.longDescription, p.additionalDetails, p.ranked, p.image_link')
            ->orderBy('p.ranked', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getNextRank(): int
    {
        $max = (int)($this->createQueryBuilder('p')
            ->select('MAX(p.ranked) as maxRank')
            ->getQuery()
            ->getSingleScalarResult() ?? 0);
        return $max + 1;
    }

    public function update(Product $entity, array $data): Product
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
        
        if(isset($data['price'])) {
            $entity->setPrice($data['price']);
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
        if(isset($data['stock_quantity'])) {
            $entity->setStockQuantity($data['stock_quantity']);
        }

        $this->getEntityManager()->flush();
        return $entity;
    }
     public function findById(int $id): ?Product
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }



    //    /**
    //     * @return Product[] Returns an array of Product objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Product
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
