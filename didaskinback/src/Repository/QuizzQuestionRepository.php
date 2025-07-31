<?php

namespace App\Repository;

use App\Entity\QuizzQuestion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<QuizzQuestion>
 */
class QuizzQuestionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, QuizzQuestion::class);
    }
    public function save(QuizzQuestion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(QuizzQuestion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    public function update(QuizzQuestion $entity, array $data): QuizzQuestion
    {
        if(isset($data['question'])) {
            $entity->setQuestion($data['question']);
        }
        if(isset($data['choiceA'])) {
            $entity->setChoiceA($data['choiceA']);
        }
        if(isset($data['choiceB'])) {
            $entity->setChoiceB($data['choiceB']);
        }
        if(isset($data['choiceC'])) {
            $entity->setChoiceC($data['choiceC']);
        }
         if(isset($data['choiceD'])) {
            $entity->setChoiceD($data['choiceD']);
        }
        if(isset($data['correctAnswer'])) {
            $entity->setCorrectAnswer($data['correctAnswer']);
        }
        if(isset($data['explanation'])) {
            $entity->setExplanation($data['explanation']);
        }

        $this->getEntityManager()->flush();
        return $entity;
    }
//    /**
//     * @return QuizzQuestion[] Returns an array of QuizzQuestion objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('q')
//            ->andWhere('q.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('q.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?QuizzQuestion
//    {
//        return $this->createQueryBuilder('q')
//            ->andWhere('q.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
