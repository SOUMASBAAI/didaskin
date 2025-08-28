<?php

namespace App\Tests\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\User;

class UserControllerTest extends WebTestCase
{
    private $client;
    private $jwtToken;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $container = $this->client->getContainer();

        // Récupérer un utilisateur existant (admin recommandé)
        $user = $container->get('doctrine')
            ->getRepository(User::class)
            ->findOneBy(['role' => 'ROLE_ADMIN']);

        $this->assertNotNull($user, "Aucun utilisateur admin trouvé pour les tests.");

        // Générer le JWT
        $jwtManager = $container->get(JWTTokenManagerInterface::class);
        $this->jwtToken = $jwtManager->create($user);
    }

    public function testListUsers(): void
    {
        $this->client->request('GET', '/users', [], [], [
            'HTTP_Authorization' => 'Bearer '.$this->jwtToken,
        ]);

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue($responseData['success']);
        $this->assertArrayHasKey('data', $responseData);
    }

    public function testShowUser(): void
    {
        $container = $this->client->getContainer();
        $user = $container->get('doctrine')->getRepository(User::class)->findOneBy([]);
        $this->assertNotNull($user);

        $this->client->request('GET', '/users/'.$user->getId(), [], [], [
            'HTTP_Authorization' => 'Bearer '.$this->jwtToken,
        ]);

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals($user->getId(), $responseData['data']['id']);
    }

    public function testCreateUpdateDeleteUser(): void
    {
        // --- CREATE ---
        $postData = [
            'firstName' => 'Test',
            'lastName' => 'User',
            'email' => 'testuser'.uniqid().'@example.com',
            'phoneNumber' => '0123456789',
            'role' => 'ROLE_USER',
        ];

        $this->client->request('POST', '/users/create', [], [], [
            'HTTP_Authorization' => 'Bearer '.$this->jwtToken,
            'CONTENT_TYPE' => 'application/json'
        ], json_encode($postData));

        $this->assertResponseStatusCodeSame(201);
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue($responseData['success']);
        $userId = $responseData['data']['id'];

        // --- UPDATE ---
        $updateData = ['firstName' => 'UpdatedName'];
        $this->client->request('PUT', '/users/'.$userId, [], [], [
            'HTTP_Authorization' => 'Bearer '.$this->jwtToken,
            'CONTENT_TYPE' => 'application/json'
        ], json_encode($updateData));

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertEquals('UpdatedName', $responseData['data']['firstName']);

        // --- DELETE ---
        $this->client->request('DELETE', '/users/'.$userId, [], [], [
            'HTTP_Authorization' => 'Bearer '.$this->jwtToken,
        ]);

        $this->assertResponseIsSuccessful();
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue($responseData['success']);
    }
}
