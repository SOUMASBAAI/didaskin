<?php

namespace App\Entity;

use Assert\NotBlank;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['user:read'])]
     #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?string $lastName = null;

    #[ORM\Column(length: 50)]
    #[Groups(['user:read'])]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?string $firstName = null;

    #[ORM\Column(length: 180)]  
    #[Groups(['user:read'])]
    #[Assert\NotBlank(message: "Le label ne doit pas être vide")]
    private ?string $email = null;

    #[ORM\Column(length: 80)]
    #[Ignore]
    private ?string $password = null;

    #[ORM\Column(length: 20)]
    #[Groups(['user:read'])]
    private ?string $phoneNumber = null;

    #[ORM\Column(length: 50)]
    #[Groups(['user:read'])]
    private ?string $role = null; // ex: "ROLE_ADMIN" ou "ROLE_USER"

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeImmutable $updated_at = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read'])]
    private ?bool $is_subscribed = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $reset_token = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $reset_token_expires_at = null;

    // --- Getters / Setters ---

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): static
    {
        $this->phoneNumber = $phoneNumber;
        return $this;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): static
    {
        $this->role = $role;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(?\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    public function isSubscribed(): ?bool
    {
        return $this->is_subscribed;
    }

    public function setIsSubscribed(?bool $is_subscribed): static
    {
        $this->is_subscribed = $is_subscribed;
        return $this;
    }

    public function getResetToken(): ?string
    {
        return $this->reset_token;
    }

    public function setResetToken(?string $reset_token): static
    {
        $this->reset_token = $reset_token;
        return $this;
    }

    public function getResetTokenExpiresAt(): ?\DateTimeImmutable
    {
        return $this->reset_token_expires_at;
    }

    public function setResetTokenExpiresAt(?\DateTimeImmutable $expiresAt): static
    {
        $this->reset_token_expires_at = $expiresAt;
        return $this;
    }

    // --- Implémentation des interfaces UserInterface et PasswordAuthenticatedUserInterface ---

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        // Ensure we always return an array and handle the role properly
        $roles = [];
        
        if ($this->role) {
            $roles[] = $this->role;
        }
        
        // Always add ROLE_USER as a base role
        if (!in_array('ROLE_USER', $roles)) {
            $roles[] = 'ROLE_USER';
        }
        
        return array_unique($roles);
    }

    public function eraseCredentials(): void
    {
        // Pas d'infos sensibles à effacer ici
    }
}

