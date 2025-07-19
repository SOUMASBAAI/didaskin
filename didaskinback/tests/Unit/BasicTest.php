<?php

namespace App\Tests;

use App\Kernel;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class BasicTest extends KernelTestCase{

    public function testEnvironnementIsOk(): void
    {
       $this->assertTrue(true);
    }
}