<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $table = 'games';
    protected $primaryKey = 'game_id';

    protected $fillable = [
        'name',
        'webmail_url',
        'guide_url',
        'email_template',
    ];

    public function accounts()
    {
        return $this->hasMany(Account::class, 'game_id', 'game_id');
    }
}
