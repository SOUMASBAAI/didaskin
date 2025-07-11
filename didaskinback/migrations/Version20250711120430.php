<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250711120430 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE category (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, created_by_id INTEGER NOT NULL, label VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, CONSTRAINT FK_64C19C1B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_64C19C1B03A8386 ON category (created_by_id)');
        $this->addSql('CREATE TABLE newsletter (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, object VARCHAR(255) NOT NULL, content VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE TABLE notification (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, slug VARCHAR(255) NOT NULL, message VARCHAR(255) DEFAULT NULL, is_read BOOLEAN NOT NULL, label VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE TABLE notification_user (notification_id INTEGER NOT NULL, user_id INTEGER NOT NULL, PRIMARY KEY(notification_id, user_id), CONSTRAINT FK_35AF9D73EF1A9D84 FOREIGN KEY (notification_id) REFERENCES notification (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_35AF9D73A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_35AF9D73EF1A9D84 ON notification_user (notification_id)');
        $this->addSql('CREATE INDEX IDX_35AF9D73A76ED395 ON notification_user (user_id)');
        $this->addSql('CREATE TABLE product (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, created_by_id INTEGER NOT NULL, label VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, image VARCHAR(255) NOT NULL, stock_quantity INTEGER NOT NULL, slug VARCHAR(255) NOT NULL, keywords VARCHAR(255) NOT NULL, CONSTRAINT FK_D34A04ADB03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_D34A04ADB03A8386 ON product (created_by_id)');
        $this->addSql('CREATE TABLE quizz_question (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, question VARCHAR(255) NOT NULL, choice_a VARCHAR(255) NOT NULL, choice_b VARCHAR(255) NOT NULL, choice_c VARCHAR(255) NOT NULL, correct_answer INTEGER NOT NULL, explanation VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE TABLE service (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, created_by_id INTEGER NOT NULL, category_id INTEGER NOT NULL, label VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, service_duration DOUBLE PRECISION NOT NULL, price DOUBLE PRECISION NOT NULL, image VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, keywords VARCHAR(255) NOT NULL, CONSTRAINT FK_E19D9AD2B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_E19D9AD212469DE2 FOREIGN KEY (category_id) REFERENCES category (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_E19D9AD2B03A8386 ON service (created_by_id)');
        $this->addSql('CREATE INDEX IDX_E19D9AD212469DE2 ON service (category_id)');
        $this->addSql('CREATE TABLE trafic (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nb_visits INTEGER NOT NULL, date DATETIME NOT NULL)');
        $this->addSql('CREATE TABLE "user" (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, last_name VARCHAR(50) NOT NULL, first_name VARCHAR(50) NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(80) NOT NULL, phone_number VARCHAR(20) NOT NULL, role VARCHAR(50) NOT NULL, created_at DATETIME DEFAULT NULL --(DC2Type:datetime_immutable)
        , updated_at DATETIME DEFAULT NULL --(DC2Type:datetime_immutable)
        , is_subscribed BOOLEAN DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON "user" (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE newsletter');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE notification_user');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE quizz_question');
        $this->addSql('DROP TABLE service');
        $this->addSql('DROP TABLE trafic');
        $this->addSql('DROP TABLE "user"');
    }
}
