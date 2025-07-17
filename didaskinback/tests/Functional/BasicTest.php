<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use App\Kernel;

class BasicTest extends WebTestCase
{
    protected static function getKernelClass(): string
    {
        return Kernel::class;
    }

    public function testApiRootReturns404(): void
    {
        $client = static::createClient();
        $client->request(Request::METHOD_GET, '/');

        // On attend ici une 404 puisque pas de route frontend
        $this->assertResponseStatusCodeSame(404);
    }
}
