<?php

namespace App\Repository;

use App\Entity\Newsletter;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Newsletter>
 */
class NewsletterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Newsletter::class);
    }
    public function save(Newsletter $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function remove(Newsletter $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function findNewsletters(): array
    {
        return $this->createQueryBuilder('n')
            ->orderBy('n.id', 'ASC')
            ->getQuery()
            ->getResult();
    }
    public function update(Newsletter $entity, array $data): Newsletter
    {
        if(isset($data['label'])) {
            $entity->setLabel($data['label']);
        }
        if(isset($data['shortDescription'])) {
            $entity->setShortDescription($data['shortDescription']);
        }
        if(isset($data['image_link'])) {
            $entity->setImageLink($data['image_link']);
        }
        if(isset($data['actionCall'])) {
            $entity->setActionCall($data['actionCall']);
        }
        if(isset($data['url'])) {
            $entity->setUrl($data['url']);
        }
        if(isset($data['content'])) {
            $entity->setContent($data['content']);
        }
        if(isset($data['status'])) {
            $entity->setStatus($data['status']);
        }

        $this->getEntityManager()->flush();
        return $entity;
    }



    //    /**
    //     * @return Newsletter[] Returns an array of Newsletter objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('n')
    //            ->andWhere('n.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('n.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Newsletter
    //    {
    //        return $this->createQueryBuilder('n')
    //            ->andWhere('n.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
