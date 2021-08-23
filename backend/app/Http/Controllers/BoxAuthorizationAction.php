<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Events\BoxAccessWasGranted;
use App\Events\BoxAccessWasProhibited;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BoxAuthorizationAction
{
    public function __invoke(Request $request): Response
    {
        $uid = (string) $request->uid;

        if (Card::existsByUid($uid)) {
            event(new BoxAccessWasGranted($uid));
            return $this->grantAccess();
        }

        event(new BoxAccessWasProhibited($uid));
        return $this->prohibitAccess();
    }

    private function grantAccess(): Response
    {
        return response()->noContent(200);
    }

    private function prohibitAccess(): Response
    {
        return response()->noContent(403);
    }
}
