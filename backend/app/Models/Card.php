<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    static function existsByUid(string $uid)
    {
        return static::query()->where('uid', '=', $uid)->exists() === true;
    }
}
