<?php

namespace App\Entity;

use App\Repository\ServiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ServiceRepository::class)]
class Service
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['service:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['service:read'])]
    private ?string $label = null;

    #[ORM\Column]
    #[Groups(['service:read'])]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?string $shortDescription = null;

    #[ORM\Column]
    #[Groups(['service:read'])]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?string $longDescription = null;

    #[ORM\Column]
    #[Groups(['service:read'])]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?string $additionalDetails = null;

    #[ORM\Column(length: 255)]
    #[Groups(['service:read'])]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?float $ServiceDuration = null;

    #[ORM\Column]
    #[Groups(['service:read'])]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?float $price = null;

    #[ORM\Column(length: 255)]
    #[Groups(['service:read'])]
    private ?string $image_link = null;

    #[ORM\Column(length: 255)]
    #[Groups(['service:read'])]
    private ?string $slug = null;

    #[ORM\ManyToOne(inversedBy: 'Services')]
    #[Groups(['service:read'])]
    private ?SubCategory $subCategory = null;

    #[ORM\Column(name: '`ranked`')]
    #[Groups(['service:read'])]
    private ?int $ranked = null;

    #[ORM\Column(options: ["default" => false])]
    #[Groups(['service:read'])]
    private bool $featuredLanding = false;

    #[ORM\Column(nullable: true)]
    #[Groups(['service:read'])]
    private ?int $featuredRank = null;

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

    public function setAdditionalDetails(string $additionalDetails): static
    {
        $this->additionalDetails = $additionalDetails;

        return $this;
    }

    public function getServiceDuration(): ?float
    {
        return $this->ServiceDuration;
    }

    public function setServiceDuration(float $ServiceDuration): static
    {
        $this->ServiceDuration = $ServiceDuration;

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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getSubCategory(): ?SubCategory
    {
        return $this->subCategory;
    }

    public function setSubCategory(?SubCategory $subCategory): static
    {
        $this->subCategory = $subCategory;

        return $this;
    }

    public function getRanked(): ?int
    {
        return $this->ranked;
    }

    public function setRanked(int $ranked): static
    {
        $this->ranked = $ranked;

        return $this;
    }

    public function isFeaturedLanding(): bool
    {
        return (bool)$this->featuredLanding;
    }

    public function setFeaturedLanding(bool $v): static
    {
        $this->featuredLanding = $v;
        return $this;
    }

    public function getFeaturedRank(): ?int
    {
        return $this->featuredRank;
    }

    public function setFeaturedRank(?int $v): static
    {
        $this->featuredRank = $v;
        return $this;
    }
}