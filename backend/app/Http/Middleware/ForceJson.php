<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceJson
{
    public function handle(Request $request, Closure $next): mixed
    {
        $request->header('Accept', 'application/json');

        return $next($request);
    }
}
