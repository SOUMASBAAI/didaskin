<?php
// src/Controller/Api/UserController.php
namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @Route("/api/users")
 * @IsGranted("ROLE_ADMIN")
 */
class UserController extends AbstractController
{
    private $em;
    private $userRepo;
    private $passwordHasher;
    private $serializer;
    private $validator;

    public function __construct(
        EntityManagerInterface $em,
        UserRepository $userRepo,
        UserPasswordHasherInterface $passwordHasher,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ) {
        $this->em = $em;
        $this->userRepo = $userRepo;
        $this->passwordHasher = $passwordHasher;
        $this->serializer = $serializer;
        $this->validator = $validator;
    }

    /**
     * @Route("", name="api_users_list", methods={"GET"})
     */
    public function list(): Response
    {
        $users = $this->userRepo->findAll();
        $json = $this->serializer->serialize($users, 'json', ['groups' => ['user:read']]);
        return $this->json(json_decode($json), 200);
    }

    /**
     * @Route("/{id}", name="api_users_show", methods={"GET"})
     */
    public function show(User $user): Response
    {
        $json = $this->serializer->serialize($user, 'json', ['groups' => ['user:read']]);
        return $this->json(json_decode($json), 200);
    }

    /**
     * @Route("", name="api_users_create", methods={"POST"})
     */
    public function create(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email'] ?? null);
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);
        if (isset($data['password'])) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        }

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return $this->json(['error' => $errorsString], 400);
        }

        $this->em->persist($user);
        $this->em->flush();

        $json = $this->serializer->serialize($user, 'json', ['groups' => ['user:read']]);
        return $this->json(json_decode($json), 201);
    }

    /**
     * @Route("/{id}", name="api_users_update", methods={"PUT"})
     */
    public function update(Request $request, User $user): Response
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        }
        if (isset($data['password'])) {
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        }

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['error' => (string) $errors], 400);
        }

        $this->em->flush();

        $json = $this->serializer->serialize($user, 'json', ['groups' => ['user:read']]);
        return $this->json(json_decode($json), 200);
    }

    /**
     * @Route("/{id}", name="api_users_delete", methods={"DELETE"})
     */
    public function delete(User $user): Response
    {
        $this->em->remove($user);
        $this->em->flush();

        return $this->json(null, 204);
    }
}
