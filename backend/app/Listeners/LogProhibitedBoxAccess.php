<?php

namespace App\Listeners;

use App\Models\AccessLog;
use App\Events\BoxAccessWasProhibited;

class LogProhibitedBoxAccess
{
    public function handle(BoxAccessWasProhibited $event)
    {
        $uid = $event->uid();

        $newLogEntry = new AccessLog();
        $newLogEntry->uid = $uid;
        $newLogEntry->at_time = now();
        $newLogEntry->access_granted = false;

        $newLogEntry->save();
    }
}
