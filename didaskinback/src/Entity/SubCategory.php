<?php

namespace App\Entity;

use App\Repository\SubCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ORM\Entity(repositoryClass: SubCategoryRepository::class)]
class SubCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['subcategory:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['subcategory:read'])]
    private ?string $label = null;

    #[ORM\Column(length: 255)]
    #[Groups(['subcategory:read'])]
    private ?string $image_link = null;

    #[ORM\Column(length: 255)]
    #[Groups(['subcategory:read'])]
    private ?string $slug = null;

    #[ORM\Column(name: '`ranked`')]
    #[Groups(['subcategory:read'])]
    private ?int $ranked = null;

    /**
     * @var Collection<int, Service>
     */
    #[ORM\OneToMany(targetEntity: Service::class, mappedBy: 'subCategory')]
    private Collection $Services;

    #[ORM\ManyToOne(inversedBy: 'subCategories')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['subcategory:read'])]
    private ?Category $category = null;

    public function __construct()
    {
        $this->Services = new ArrayCollection();
    }

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

    public function getRanked(): ?int
    {
        return $this->ranked;
    }

    public function setRanked(int $ranked): static
    {
        $this->ranked = $ranked;

        return $this;
    }

    /**
     * @return Collection<int, Service>
     */
    public function getServices(): Collection
    {
        return $this->Services;
    }

    public function addService(Service $service): static
    {
        if (!$this->Services->contains($service)) {
            $this->Services->add($service);
            $service->setSubCategory($this);
        }

        return $this;
    }

    public function removeService(Service $service): static
    {
        if ($this->Services->removeElement($service)) {
            // set the owning side to null (unless already changed)
            if ($service->getSubCategory() === $this) {
                $service->setSubCategory(null);
            }
        }

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }
}
