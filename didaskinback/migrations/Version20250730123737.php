<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250730123737 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE service ADD COLUMN rank INTEGER NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__service AS SELECT id, sub_category_id, label, short_description, long_description, additional_details, service_duration, price, image_link, slug FROM service');
        $this->addSql('DROP TABLE service');
        $this->addSql('CREATE TABLE service (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, sub_category_id INTEGER DEFAULT NULL, label VARCHAR(255) NOT NULL, short_description VARCHAR(255) NOT NULL, long_description VARCHAR(255) NOT NULL, additional_details VARCHAR(255) NOT NULL, service_duration DOUBLE PRECISION NOT NULL, price DOUBLE PRECISION NOT NULL, image_link VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, CONSTRAINT FK_E19D9AD2F7BFE87C FOREIGN KEY (sub_category_id) REFERENCES sub_category (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO service (id, sub_category_id, label, short_description, long_description, additional_details, service_duration, price, image_link, slug) SELECT id, sub_category_id, label, short_description, long_description, additional_details, service_duration, price, image_link, slug FROM __temp__service');
        $this->addSql('DROP TABLE __temp__service');
        $this->addSql('CREATE INDEX IDX_E19D9AD2F7BFE87C ON service (sub_category_id)');
    }
}
