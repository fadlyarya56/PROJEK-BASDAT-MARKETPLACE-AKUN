<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $table = 'accounts';
    protected $primaryKey = 'account_id';

    protected $fillable = [
        'game_id',
        'title',
        'price',
        'image_url',
        'description',
        'account_email',
        'email_password',
        'game_password',
        'status',
        'sold_at',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id', 'game_id');
    }
}
