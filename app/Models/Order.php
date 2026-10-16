<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'buyer_id',
        'account_id',
        'delivery_email',
        'security_pin',
        'status', // menunggu | menunggu_konfirmasi | valid | ditolak
    ];

    protected $hidden = [
        'security_pin',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id', 'account_id')->withTrashed();
    }

    public function buyer()
    {
        return $this->belongsTo(Buyer::class, 'buyer_id', 'buyer_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id', 'order_id');
    }

    public function statusLogs()
    {
        return $this->hasMany(StatusLog::class, 'account_id', 'account_id')->orderByDesc('changed_at');
    }
}
