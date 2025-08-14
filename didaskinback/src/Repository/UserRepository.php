<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function update(User $entity, array $data): User
    {
        if(isset($data['firstName'])) {
            $entity->setFirstName($data['firstName']);
        }
        if(isset($data['lastName'])) {
            $entity->setLastName($data['lastName']);
        }
        if(isset($data['email'])) {
            $entity->setEmail($data['email']);
        }
        if(isset($data['phoneNumber'])) {
            $entity->setPhoneNumber($data['phoneNumber']);
        }
        if(isset($data['role'])) {
            $entity->setRole($data['role']);
        }
        if(isset($data['is_subscribed'])) {
            $entity->setIsSubscribed($data['is_subscribed']);
        }

        $this->getEntityManager()->flush();
        return $entity;
    }

    public function findByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByRole(string $role): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.role = :role')
            ->setParameter('role', $role)
            ->orderBy('u.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findSubscribedUsers(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.is_subscribed = :subscribed')
            ->setParameter('subscribed', true)
            ->orderBy('u.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findNonSubscribedUsers(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.is_subscribed = :subscribed OR u.is_subscribed IS NULL')
            ->setParameter('subscribed', false)
            ->orderBy('u.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findAllOrderedByCreatedAt(): array
    {
        return $this->createQueryBuilder('u')
            ->orderBy('u.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return User[] Returns an array of User objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?User
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
