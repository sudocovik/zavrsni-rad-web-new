<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string uid
 * @property string at_time
 * @property boolean access_granted
 */
class AccessLog extends Model
{
    public $timestamps = false;

    protected $casts = [
        'at_time' => 'datetime',
        'access_granted' => 'boolean'
    ];
}
