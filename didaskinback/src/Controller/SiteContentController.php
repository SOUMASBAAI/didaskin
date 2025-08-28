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

    private function findOrCreateCatalogue(): SiteContent
    {
        $repo = $this->em->getRepository(SiteContent::class);
        $catalogue = $repo->findOneBy(['keyName' => 'catalogue']);
        if (!$catalogue) {
            $catalogue = (new SiteContent())
                ->setKeyName('catalogue')
                ->setTitle(null)
                ->setDescription(null)
                ->setCta(null)
                ->setImage(null);
            $this->em->persist($catalogue);
            $this->em->flush();
        }
        return $catalogue;
    }

    private function findOrCreateAbout(): SiteContent
    {
        $repo = $this->em->getRepository(SiteContent::class);
        $about = $repo->findOneBy(['keyName' => 'about']);
        if (!$about) {
            $about = (new SiteContent())
                ->setKeyName('about')
                ->setTitle(null)
                ->setDescription(null)
                ->setCta(null)
                ->setImage(null);
            $this->em->persist($about);
            $this->em->flush();
        }
        return $about;
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

    #[Route('/catalogue', name: 'catalogue_get', methods: ['GET'])]
    public function getCatalogue(): JsonResponse
    {
        $catalogue = $this->findOrCreateCatalogue();
        return $this->json([
            'success' => true,
            'data' => [
                'title' => $catalogue->getTitle(),
                'description' => $catalogue->getDescription(),
                'cta' => $catalogue->getCta(),
                'image' => $catalogue->getImage(),
            ],
        ]);
    }

    #[Route('/catalogue', name: 'catalogue_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateCatalogue(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $catalogue = $this->findOrCreateCatalogue();

        if (array_key_exists('title', $data)) $catalogue->setTitle($data['title']);
        if (array_key_exists('description', $data)) $catalogue->setDescription($data['description']);
        if (array_key_exists('cta', $data)) $catalogue->setCta($data['cta']);
        if (array_key_exists('image', $data)) $catalogue->setImage($data['image']);

        $this->em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Catalogue content updated',
        ]);
    }

    #[Route('/about', name: 'about_get', methods: ['GET'])]
    public function getAbout(): JsonResponse
    {
        $about = $this->findOrCreateAbout();
        return $this->json([
            'success' => true,
            'data' => [
                'image' => $about->getImage(),
                'title' => $about->getTitle(),
                'description' => $about->getDescription(),
                'cta' => $about->getCta(),
            ],
        ]);
    }

    #[Route('/about', name: 'about_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateAbout(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true) ?? [];
        $about = $this->findOrCreateAbout();

        if (array_key_exists('image', $data)) $about->setImage($data['image']);
        if (array_key_exists('title', $data)) $about->setTitle($data['title']);
        if (array_key_exists('description', $data)) $about->setDescription($data['description']);
        if (array_key_exists('cta', $data)) $about->setCta($data['cta']);

        $this->em->flush();

        return $this->json([
            'success' => true,
            'message' => 'About content updated',
        ]);
    }
} 