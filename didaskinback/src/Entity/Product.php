<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?string $label = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "Le prix ne doit pas être vide")]
    #[Assert\Type(type: 'float', message: "Le prix doit être un nombre.")]
    private ?float $price = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le lien de l'image ne doit pas être vide")]
    private ?string $image_link = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "La quantité en stock ne doit pas être vide")]
    #[Assert\Type(type: 'integer', message: "La quantité doit être un nombre entier.")]
    private ?int $stock_quantity = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le slug ne doit pas être vide")]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "La description courte ne doit pas être vide")]
    private ?string $shortDescription = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "La description longue ne doit pas être vide")]
    private ?string $longDescription = null;

    #[ORM\Column(length: 255)]
    private ?string $additionalDetails = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "Le rang ne doit pas être vide")]
    #[Assert\Type(type: 'integer', message: "Le rang doit être un nombre entier.")]
    private ?int $rank = null;

    // Getters et setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getImageLink(): ?string
    {
        return $this->image_link;
    }

    public function setImageLink(string $image_link): static
    {
        $this->image_link = $image_link;
        return $this;
    }

    public function getStockQuantity(): ?int
    {
        return $this->stock_quantity;
    }

    public function setStockQuantity(int $stock_quantity): static
    {
        $this->stock_quantity = $stock_quantity;
        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getShortDescription(): ?string
    {
        return $this->shortDescription;
    }

    public function setShortDescription(string $shortDescription): static
    {
        $this->shortDescription = $shortDescription;
        return $this;
    }

    public function getLongDescription(): ?string
    {
        return $this->longDescription;
    }

    public function setLongDescription(string $longDescription): static
    {
        $this->longDescription = $longDescription;
        return $this;
    }

    public function getAdditionalDetails(): ?string
    {
        return $this->additionalDetails;
    }

    public function setAdditionalDetails(?string $additionalDetails): static
    {
        $this->additionalDetails = $additionalDetails;
        return $this;
    }

    public function getRank(): ?int
    {
        return $this->rank;
    }

    public function setRank(int $rank): static
    {
        $this->rank = $rank;
        return $this;
    }
}
