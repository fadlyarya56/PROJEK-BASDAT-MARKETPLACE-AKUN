<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
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
        'status', // tersedia | tertunda | terjual
        'sold_at',
    ];

    // Biar password akun tidak ikut keluar kalau model di-return sebagai JSON
    protected $hidden = [
        'account_email',
        'email_password',
        'game_password',
    ];

    protected $casts = [
        'price'   => 'decimal:2',
        'sold_at' => 'datetime',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id', 'game_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'account_id', 'account_id');
    }
}
