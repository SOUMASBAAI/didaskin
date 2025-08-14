<?php

namespace App\Service;

use App\Entity\Newsletter;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;
use Psr\Log\LoggerInterface;

class EmailService
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger,
        private MailerInterface $mailer
    ) {}

    /**
     * Send newsletter to all subscribed users
     */
    public function sendNewsletterToSubscribers(Newsletter $newsletter): array
    {
        $result = [
            'success' => true,
            'sent' => 0,
            'failed' => 0,
            'errors' => []
        ];

        try {
            // Get all subscribed users
            $subscribedUsers = $this->userRepository->findSubscribedUsers();
            
            if (empty($subscribedUsers)) {
                $result['message'] = 'No subscribed users found';
                return $result;
            }

            // For now, we'll simulate email sending since mailer might not be available
            foreach ($subscribedUsers as $user) {
                $emailSent = $this->sendNewsletterToUser($newsletter, $user);
                
                if ($emailSent) {
                    $result['sent']++;
                } else {
                    $result['failed']++;
                    $result['errors'][] = "Failed to send to: {$user->getEmail()}";
                }
            }

            $result['message'] = "Newsletter sent to {$result['sent']} subscribers";
            
            // Log the sending
            $this->logger->info('Newsletter sent', [
                'newsletter_id' => $newsletter->getId(),
                'sent' => $result['sent'],
                'failed' => $result['failed']
            ]);

        } catch (\Exception $e) {
            $result['success'] = false;
            $result['errors'][] = $e->getMessage();
            $this->logger->error('Newsletter sending failed', [
                'newsletter_id' => $newsletter->getId(),
                'error' => $e->getMessage()
            ]);
        }

        return $result;
    }

    /**
     * Send newsletter to a specific user
     */
    private function sendNewsletterToUser(Newsletter $newsletter, User $user): bool
    {
        try {
            // Use Symfony Mailer
            return $this->sendWithMailer($newsletter, $user);
        } catch (\Exception $e) {
            $this->logger->error('Failed to send newsletter to user', [
                'user_id' => $user->getId(),
                'user_email' => $user->getEmail(),
                'newsletter_id' => $newsletter->getId(),
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Send email using PHP's built-in mail function
     */
    private function sendWithPhpMail(Newsletter $newsletter, User $user): bool
    {
        $to = $user->getEmail();
        $subject = $newsletter->getLabel();
        $htmlMessage = $this->generateNewsletterHtml($newsletter, $user);
        $textMessage = $this->generateNewsletterText($newsletter, $user);
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: DIDA SKIN <noreply@didaskin.com>',
            'Reply-To: noreply@didaskin.com',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Try to send the email
        $sent = mail($to, $subject, $htmlMessage, implode("\r\n", $headers));
        
        if ($sent) {
            $this->logger->info('Email sent via PHP mail function', [
                'to' => $to,
                'subject' => $subject,
                'newsletter_id' => $newsletter->getId()
            ]);
            return true;
        } else {
            $this->logger->warning('PHP mail function failed, falling back to simulation', [
                'to' => $to,
                'subject' => $subject,
                'newsletter_id' => $newsletter->getId()
            ]);
            return false;
        }
    }

    /**
     * Send email using Symfony Mailer
     */
    private function sendWithMailer(Newsletter $newsletter, User $user): bool
    {
        $email = (new Email())
            ->from(new Address('soumiaasbaai@gmail.com', 'DIDA SKIN'))
            ->replyTo(new Address('noreply@didaskin.com', 'DIDA SKIN'))
            ->to(new Address($user->getEmail(), $user->getFirstName() . ' ' . $user->getLastName()))
            ->subject($newsletter->getLabel())
            ->html($this->generateNewsletterHtml($newsletter, $user))
            ->text($this->generateNewsletterText($newsletter, $user));

        $this->mailer->send($email);
        
        $this->logger->info('Email sent via Symfony Mailer', [
            'to' => $user->getEmail(),
            'subject' => $newsletter->getLabel(),
            'newsletter_id' => $newsletter->getId()
        ]);
        
        return true;
    }

    /**
     * Simulate email sending and save to file for development/testing
     */
    private function simulateEmailSending(Newsletter $newsletter, User $user): bool
    {
        // Simulate email sending delay
        usleep(100000); // 0.1 second delay
        
        // Save email content to file for testing
        $this->saveEmailToFile($newsletter, $user);
        
        $this->logger->info('Email sent (simulated)', [
            'to' => $user->getEmail(),
            'subject' => $newsletter->getLabel(),
            'newsletter_id' => $newsletter->getId()
        ]);
        
        return true;
    }

    /**
     * Save email content to file for testing purposes
     */
    private function saveEmailToFile(Newsletter $newsletter, User $user): void
    {
        $emailDir = dirname(__DIR__, 2) . '/var/emails';
        if (!is_dir($emailDir)) {
            mkdir($emailDir, 0755, true);
        }

        $filename = sprintf(
            'newsletter_%d_to_%s_%s.html',
            $newsletter->getId(),
            $user->getId(),
            date('Y-m-d_H-i-s')
        );

        $emailContent = $this->generateNewsletterHtml($newsletter, $user);
        
        file_put_contents($emailDir . '/' . $filename, $emailContent);
        
        $this->logger->info('Email saved to file', [
            'file' => $filename,
            'user_email' => $user->getEmail()
        ]);
    }

    /**
     * Generate HTML version of newsletter using simple HTML template
     */
    private function generateNewsletterHtml(Newsletter $newsletter, User $user): string
    {
        $templatePath = dirname(__DIR__, 2) . '/templates/emails/newsletter.html';
        $template = file_get_contents($templatePath);
        
        // Replace placeholders with actual content
        $replacements = [
            '{{NEWSLETTER_TITLE}}' => htmlspecialchars($newsletter->getLabel()),
            '{{USER_FIRST_NAME}}' => htmlspecialchars($user->getFirstName()),
            '{{USER_LAST_NAME}}' => htmlspecialchars($user->getLastName()),
            '{{NEWSLETTER_SHORT_DESCRIPTION}}' => htmlspecialchars($newsletter->getShortDescription()),
            '{{NEWSLETTER_CONTENT}}' => htmlspecialchars($newsletter->getContent()),
            '{{NEWSLETTER_IMAGE}}' => $this->generateImageHtml($newsletter),
            '{{NEWSLETTER_CTA_BUTTON}}' => $this->generateCtaButtonHtml($newsletter)
        ];
        
        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    /**
     * Generate image HTML if newsletter has an image
     */
    private function generateImageHtml(Newsletter $newsletter): string
    {
        if ($newsletter->getImageLink()) {
            return '<img src="' . htmlspecialchars($newsletter->getImageLink()) . '" alt="Newsletter Image" class="newsletter-image">';
        }
        return '';
    }

    /**
     * Generate CTA button HTML if newsletter has action call and URL
     */
    private function generateCtaButtonHtml(Newsletter $newsletter): string
    {
        if ($newsletter->getActionCall() && $newsletter->getUrl()) {
            return '<a href="' . htmlspecialchars($newsletter->getUrl()) . '" class="cta-button">' . htmlspecialchars($newsletter->getActionCall()) . '</a>';
        }
        return '';
    }

    /**
     * Generate CTA text for plain text version
     */
    private function generateCtaText(Newsletter $newsletter): string
    {
        if ($newsletter->getActionCall() && $newsletter->getUrl()) {
            return $newsletter->getActionCall() . ': ' . $newsletter->getUrl();
        }
        return '';
    }

    /**
     * Generate text version of newsletter using simple text template
     */
    private function generateNewsletterText(Newsletter $newsletter, User $user): string
    {
        $templatePath = dirname(__DIR__, 2) . '/templates/emails/newsletter.txt';
        $template = @file_get_contents($templatePath);

        if ($template === false) {
            $template = "Bonjour {{USER_FIRST_NAME}} {{USER_LAST_NAME}},\n\n{{NEWSLETTER_TITLE}}\n\n{{NEWSLETTER_SHORT_DESCRIPTION}}\n\n{{NEWSLETTER_CONTENT}}\n\n{{NEWSLETTER_CTA_LINK}}\n";
        }
        
        // Replace placeholders with actual content
        $replacements = [
            '{{NEWSLETTER_TITLE}}' => $newsletter->getLabel(),
            '{{USER_FIRST_NAME}}' => $user->getFirstName(),
            '{{USER_LAST_NAME}}' => $user->getLastName(),
            '{{NEWSLETTER_SHORT_DESCRIPTION}}' => $newsletter->getShortDescription(),
            '{{NEWSLETTER_CONTENT}}' => $newsletter->getContent(),
            '{{NEWSLETTER_CTA_LINK}}' => $this->generateCtaText($newsletter)
        ];
        
        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }
} 