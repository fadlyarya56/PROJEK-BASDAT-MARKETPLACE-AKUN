<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'accounts';

    protected $primaryKey = 'account_id';

    protected $fillable = [
        'game_id',
        'title',
        'price',
        'image_url',
        'images',
        'description',
        'account_email',
        'email_password',
        'game_password',
        'status', // tersedia | tertunda | terjual
        'is_hot',
        'sold_at',
    ];

    // Biar password akun tidak ikut keluar kalau model di-return sebagai JSON
    protected $hidden = [
        'account_email',
        'email_password',
        'game_password',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'images' => 'array',
        'is_hot' => 'boolean',
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

    protected $appends = ['image_full_url', 'images_list'];

    public function getImageFullUrlAttribute(): ?string
    {
        // Prioritaskan gambar pertama dari images jika image_url kosong
        $target = $this->image_url;
        if (! $target && is_array($this->images) && ! empty($this->images)) {
            $target = $this->images[0];
        }

        if (! $target) {
            return null;
        }

        if (str_starts_with($target, 'http://') || str_starts_with($target, 'https://')) {
            return $target;
        }

        return asset('storage/'.ltrim($target, '/'));
    }

    public function getImagesListAttribute(): array
    {
        $list = [];

        if (is_array($this->images) && ! empty($this->images)) {
            foreach ($this->images as $img) {
                if ($img) {
                    $url = (str_starts_with($img, 'http://') || str_starts_with($img, 'https://'))
                        ? $img
                        : asset('storage/'.ltrim($img, '/'));
                    $list[] = $url;
                }
            }
        }

        // Jika images kosong tapi image_url ada, masukkan image_url sebagai gambar tunggal
        if (empty($list) && $this->image_url) {
            $list[] = $this->image_full_url;
        }

        return $list;
    }
}
