<?php

namespace App\Entity;

use App\Repository\QuizzQuestionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuizzQuestionRepository::class)]
class QuizzQuestion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $question = null;

    #[ORM\Column(length: 255)]
    private ?string $choiceA = null;

    #[ORM\Column(length: 255)]
    private ?string $choiceB = null;

    #[ORM\Column(length: 255)]
    private ?string $choiceC = null;

    #[ORM\Column]
    private ?int $correctAnswer = null;

    #[ORM\Column(length: 255)]
    private ?string $explanation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(string $question): static
    {
        $this->question = $question;

        return $this;
    }

    public function getChoiceA(): ?string
    {
        return $this->choiceA;
    }

    public function setChoiceA(string $choiceA): static
    {
        $this->choiceA = $choiceA;

        return $this;
    }

    public function getChoiceB(): ?string
    {
        return $this->choiceB;
    }

    public function setChoiceB(string $choiceB): static
    {
        $this->choiceB = $choiceB;

        return $this;
    }

    public function getChoiceC(): ?string
    {
        return $this->choiceC;
    }

    public function setChoiceC(string $choiceC): static
    {
        $this->choiceC = $choiceC;

        return $this;
    }

    public function getCorrectAnswer(): ?int
    {
        return $this->correctAnswer;
    }

    public function setCorrectAnswer(int $correctAnswer): static
    {
        $this->correctAnswer = $correctAnswer;

        return $this;
    }

    public function getExplanation(): ?string
    {
        return $this->explanation;
    }

    public function setExplanation(string $explanation): static
    {
        $this->explanation = $explanation;

        return $this;
    }
}
