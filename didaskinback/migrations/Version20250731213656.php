<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250731213656 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__product AS SELECT id, label, price, image_link, stock_quantity, slug, short_description, long_description, additional_details, rank FROM product');
        $this->addSql('DROP TABLE product');
        $this->addSql('CREATE TABLE product (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, label VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, image_link VARCHAR(255) NOT NULL, stock_quantity INTEGER NOT NULL, slug VARCHAR(255) NOT NULL, short_description VARCHAR(255) NOT NULL, long_description VARCHAR(255) NOT NULL, additional_details VARCHAR(255) NOT NULL, rank INTEGER NOT NULL)');
        $this->addSql('INSERT INTO product (id, label, price, image_link, stock_quantity, slug, short_description, long_description, additional_details, rank) SELECT id, label, price, image_link, stock_quantity, slug, short_description, long_description, additional_details, rank FROM __temp__product');
        $this->addSql('DROP TABLE __temp__product');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product ADD COLUMN keywords VARCHAR(255) NOT NULL');
    }
}
