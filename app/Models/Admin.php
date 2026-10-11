<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable as AuthenticatableTrait;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\Authorizable;

class Admin extends Model implements Authenticatable
{
    use AuthenticatableTrait, Authorizable;

    protected $table = 'admins';

    protected $primaryKey = 'admin_id';

    protected $fillable = [
        'username',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
