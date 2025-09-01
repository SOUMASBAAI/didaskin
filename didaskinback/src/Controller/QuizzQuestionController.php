<?php

namespace App\Controller;

use App\Entity\QuizzQuestion;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\QuizzQuestionRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;


#[Route('/quizzquestion', name: 'app_quizz_question')]
class QuizzQuestionController extends AbstractController
{
     public function __construct(
        private QuizzQuestionRepository $quizzQuestionRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {}
    
    #[Route('', name: 'list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $quizzQuestions = $this->quizzQuestionRepository->findQuizzQuestions();
       
        return $this->json([
            'success' => true,
            'data' => $quizzQuestions,
        ]);
    }

    
     #[Route('/create', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

       $quizzQuestion = new QuizzQuestion();
       $quizzQuestion->setQuestion($data['question'] ?? '');
       $quizzQuestion->setChoiceA($data['choiceA'] ?? '');
       $quizzQuestion->setChoiceB($data['choiceB'] ?? '');
       $quizzQuestion->setChoiceC($data['choiceC'] ?? '');
       $quizzQuestion->setChoiceD($data['choiceD'] ?? '');
       $quizzQuestion->setCorrectAnswer($data['correctAnswer'] ?? 0);
       $quizzQuestion->setExplanation($data['explanation'] ?? '');

        $errors= $this->validator->validate($quizzQuestion);
        if (count($errors) > 0) {
            return $this->json(
                [
                    'success' => false,
                    'errors' => $this->getErrorsFromValidator($errors),
                ],
                Response::HTTP_BAD_REQUEST
            );

        }
        $this->entityManager->persist($quizzQuestion);
        $this->entityManager->flush();

        return $this->json([
            'success' => true,
            'data' =>$quizzQuestion,
            'message' => 'Quizz crée avec succès'
        ], Response::HTTP_CREATED);
    }
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
       $quizzQuestion = $this->quizzQuestionRepository->find($id);

        if (!$quizzQuestion) {
            return $this->json(['error' => 'quizzquestionRepository introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' =>$quizzQuestion,
        ]);
    }

     #[Route('/{id}/edit', name: 'update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
       $quizzQuestion = $this->quizzQuestionRepository->find($id);

        if (!$quizzQuestion) {
            return $this->json(['error' => 'quizz introuvable'], Response::HTTP_NOT_FOUND);
        }

       $quizzQuestion = $this->quizzQuestionRepository->update($quizzQuestion, $data);
        
        return $this->json([
            'success' => true,
            'data' =>$quizzQuestion,
            'message' => 'quizz mis à jour avec succès'
        ]);
    }
    #[Route('/{id}/delete', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $quizzQuestion = $this->quizzQuestionRepository->find($id);

        if (!$quizzQuestion) {
            return $this->json(['error' => 'quizz introuvable'], Response::HTTP_NOT_FOUND);
        }

        $this->quizzQuestionRepository->remove($quizzQuestion, true);

        return $this->json([
            'success' => true,
            'message' => 'quizz supprimé avec succès'
        ]);
    }
    private function getErrorsFromValidator($errors): array
    {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = 
               
               $error->getMessage();
            
        }
        return $errorMessages;
    }

}
