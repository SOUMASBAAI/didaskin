<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class SiteContent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private string $keyName; // e.g. 'hero'

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $title = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $cta = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null; // URL

    public function getId(): ?int { return $this->id; }

    public function getKeyName(): string { return $this->keyName; }
    public function setKeyName(string $k): self { $this->keyName = $k; return $this; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(?string $v): self { $this->title = $v; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $v): self { $this->description = $v; return $this; }

    public function getCta(): ?string { return $this->cta; }
    public function setCta(?string $v): self { $this->cta = $v; return $this; }

    public function getImage(): ?string { return $this->image; }
    public function setImage(?string $v): self { $this->image = $v; return $this; }
} 