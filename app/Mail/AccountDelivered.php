<?php

namespace App\Mail;

use App\Models\Account;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountDelivered extends Mailable
{
    use Queueable, SerializesModels;

    public string $emailBody;

    public function __construct(public Account $account)
    {
        $this->emailBody = $this->buildEmailBody();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Akun '.$this->account->game->name.' - TempatAkun',
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'emails.account-delivered',
            with: [
                'emailBody' => $this->emailBody,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }

    /**
     * Gabungkan email_template dari tabel games dengan data spesifik akun.
     * Placeholder yang didukung: {game_name} {email} {email_pw} {game_pw} {webmail_url} {guide_url}
     */
    private function buildEmailBody(): string
    {
        $game = $this->account->game;

        $template = $game->email_template ?: $this->fallbackTemplate();

        return strtr($template, [
            '{game_name}' => $game->name,
            '{email}' => $this->account->account_email,
            '{email_pw}' => $this->account->email_password,
            '{game_pw}' => $this->account->game_password,
            '{webmail_url}' => $game->webmail_url ?? '-',
            '{guide_url}' => $game->guide_url ?? '-',
        ]);
    }

    /**
     * Dipakai kalau admin belum sempat isi email_template di database untuk game ini.
     */
    private function fallbackTemplate(): string
    {
        return <<<'TEXT'
AKUN {game_name} BY TEMPATAKUN

NOTE:  SEBELUM LOGIN KE DALAM GAME, AMANKAN AKUN TERLEBIH DAHULU (MENGGANTI GMAIL & PASSWORD) DENGAN PANDUAN YANG TELAH DIKIRIMKAN

Email: {email}
Pw Email: {email_pw}
Pw {game_name}: {game_pw}

Login Email untuk mengakses kode :
{webmail_url}

Panduan mengamankan akun & Login {game_name}:
{guide_url}
TEXT;
    }
}
