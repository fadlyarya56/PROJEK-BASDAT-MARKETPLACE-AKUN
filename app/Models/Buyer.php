<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{
    protected $table = 'buyers';

    protected $primaryKey = 'buyer_id';

    protected $fillable = [
        'name',
        'email',
        'phone',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'buyer_id', 'buyer_id');
    }
}
