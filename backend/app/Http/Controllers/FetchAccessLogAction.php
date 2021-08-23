<?php

namespace App\Http\Controllers;

use App\Models\AccessLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FetchAccessLogAction
{
    public function __invoke(Request $request): JsonResponse
    {
        $accessLogEntries = AccessLog::query()->orderByDesc('at_time')->get();

        return response()->json(['data' => $accessLogEntries]);
    }
}
