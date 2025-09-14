<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250914170454 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product CHANGE long_description long_description LONGTEXT DEFAULT NULL, CHANGE additional_details additional_details LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE service CHANGE long_description long_description LONGTEXT DEFAULT NULL, CHANGE additional_details additional_details LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product CHANGE long_description long_description VARCHAR(255) NOT NULL, CHANGE additional_details additional_details VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE service CHANGE long_description long_description VARCHAR(255) NOT NULL, CHANGE additional_details additional_details VARCHAR(255) NOT NULL');
    }
}
