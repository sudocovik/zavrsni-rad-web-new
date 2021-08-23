<?php

namespace App\Listeners;

use App\Models\AccessLog;
use App\Events\BoxAccessWasGranted;

class LogGrantedBoxAccess
{
    public function handle(BoxAccessWasGranted $event)
    {
        $uid = $event->uid();

        $newLogEntry = new AccessLog();
        $newLogEntry->uid = $uid;
        $newLogEntry->at_time = now();
        $newLogEntry->access_granted = true;

        $newLogEntry->save();
    }
}
