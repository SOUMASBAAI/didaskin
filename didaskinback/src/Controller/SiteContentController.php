<?php

namespace App\Controller;

use App\Entity\SiteContent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/site-content', name: 'site_content_')]
class SiteContentController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    private function findOrCreateHero(): SiteContent
    {
        $repo = $this->em->getRepository(SiteContent::class);
        $hero = $repo->findOneBy(['keyName' => 'hero']);
        if (!$hero) {
            $hero = (new SiteContent())
                ->setKeyName('hero')
                ->setTitle('BIENVENUE CHEZ DIDA SKIN')
                ->setDescription('Votre sanctuaire de beauté et de bien-être.')
                ->setCta('DÉCOUVRIR NOS SERVICES')
                ->setImage(null);
            $this->em->persist($hero);
            $this->em->flush();
        }
        return $hero;
    }

    #[Route('/hero', name: 'hero_get', methods: ['GET'])]
    public function getHero(): JsonResponse
    {
        $hero = $this->findOrCreateHero();
        return $this->json([
            'success' => true,
            'data' => [
                'title' => $hero->getTitle(),
                'description' => $hero->getDescription(),
                'cta' => $hero->getCta(),
                'image' => $hero->getImage(),
            ],
        ]);
    }

    #[Route('/hero', name: 'hero_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateHero(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $hero = $this->findOrCreateHero();

        if (array_key_exists('title', $data)) $hero->setTitle($data['title']);
        if (array_key_exists('description', $data)) $hero->setDescription($data['description']);
        if (array_key_exists('cta', $data)) $hero->setCta($data['cta']);
        if (array_key_exists('image', $data)) $hero->setImage($data['image']);

        $this->em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Hero content updated',
        ]);
    }
} 