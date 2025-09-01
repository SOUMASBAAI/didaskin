<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

final class AuthenticationControllerTest extends WebTestCase
{
    private function createClientAndJsonRequest(string $method, string $url, array $data = [])
    {
        $client = static::createClient();
        $client->request(
            $method,
            $url,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($data)
        );

        return $client;
    }

    public function testUserRegistrationAndLogin(): void
    {
        $email = 'testuser@example.com';
        $password = 'Test1234!';

        // === Inscription utilisateur ===
        $client = $this->createClientAndJsonRequest('POST', '/auth/register', [
            'firstName' => 'Test',
            'lastName' => 'User',
            'email' => $email,
            'phoneNumber' => '0123456789',
            'password' => $password
        ]);

        $responseData = json_decode($client->getResponse()->getContent(), true);

        $this->assertResponseStatusCodeSame(201);
        $this->assertTrue($responseData['success']);
        $this->assertArrayHasKey('token', $responseData['data']);

        // === Connexion utilisateur ===
        $client = $this->createClientAndJsonRequest('POST', '/auth/auth/login', [
            'email' => $email,
            'password' => $password
        ]);

        $responseData = json_decode($client->getResponse()->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertTrue($responseData['success']);
        $this->assertArrayHasKey('token', $responseData['data']);
    }

    public function testAdminRegistrationAndLogin(): void
    {
        $email = 'admin@example.com';
        $password = 'Admin1234!';

        // === Inscription admin ===
        $client = $this->createClientAndJsonRequest('POST', '/auth/admin/register', [
            'firstName' => 'Admin',
            'lastName' => 'User',
            'email' => $email,
            'phoneNumber' => '0987654321',
            'password' => $password
        ]);

        $responseData = json_decode($client->getResponse()->getContent(), true);

        $this->assertResponseStatusCodeSame(201);
        $this->assertTrue($responseData['success']);
        $this->assertArrayHasKey('token', $responseData['data']);

        // === Connexion admin ===
        $client = $this->createClientAndJsonRequest('POST', '/auth/admin/login', [
            'email' => $email,
            'password' => $password
        ]);

        $responseData = json_decode($client->getResponse()->getContent(), true);

        $this->assertResponseIsSuccessful();
        $this->assertTrue($responseData['success']);
        $this->assertArrayHasKey('token', $responseData['data']);
    }

    public function testRegistrationWithExistingEmail(): void
    {
        $email = 'duplicate@example.com';
        $password = 'Test1234!';

        // Première inscription
        $client = $this->createClientAndJsonRequest('POST', '/auth/register', [
            'firstName' => 'Test',
            'lastName' => 'User',
            'email' => $email,
            'phoneNumber' => '0123456789',
            'password' => $password
        ]);

        $this->assertResponseStatusCodeSame(201);

        // Deuxième inscription avec le même email
        $client = $this->createClientAndJsonRequest('POST', '/auth/register', [
            'firstName' => 'Another',
            'lastName' => 'User',
            'email' => $email,
            'phoneNumber' => '0000000000',
            'password' => $password
        ]);

        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertResponseStatusCodeSame(400);
        $this->assertFalse($responseData['success']);
        $this->assertEquals('Un utilisateur avec cet email existe déjà', $responseData['error']);
    }

    public function testLoginWithWrongPassword(): void
    {
        $email = 'wrongpass@example.com';
        $password = 'Correct123!';
        $wrongPassword = 'Wrong123!';

        // Inscription
        $client = $this->createClientAndJsonRequest('POST', '/auth/register', [
            'firstName' => 'Test',
            'lastName' => 'User',
            'email' => $email,
            'phoneNumber' => '0123456789',
            'password' => $password
        ]);

        $this->assertResponseStatusCodeSame(201);

        // Connexion avec mauvais mot de passe
        $client = $this->createClientAndJsonRequest('POST', '/auth/auth/login', [
            'email' => $email,
            'password' => $wrongPassword
        ]);

        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertResponseStatusCodeSame(401);
        $this->assertFalse($responseData['success']);
        $this->assertEquals('Email ou mot de passe incorrect', $responseData['error']);
    }
}
