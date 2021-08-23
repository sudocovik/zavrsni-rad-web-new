<?php

namespace App\Events;

class BoxAccessWasGranted
{
    private string $uid;

    public function __construct(string $uid)
    {
        $this->uid = $uid;
    }

    public function uid(): string
    {
        return $this->uid;
    }
}
