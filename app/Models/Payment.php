<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'order_id',
        'method',
        'proof_image',
        'status', // menunggu | dikonfirmasi | ditolak
        'confirmed_by',
        'confirmed_at',
    ];

    protected $casts = [
        'confirmed_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function confirmedBy()
    {
        return $this->belongsTo(Admin::class, 'confirmed_by', 'admin_id');
    }

    protected $appends = ['proof_image_url'];

    public function getProofImageUrlAttribute(): ?string
    {
        return $this->proof_image ? asset('storage/'.$this->proof_image) : null;
    }
}
