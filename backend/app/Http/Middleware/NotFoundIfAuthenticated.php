<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotFoundIfAuthenticated
{
    public function handle(Request $request, Closure $next, string|null $guard = null): mixed
    {
        if (Auth::guard($guard)->check()) {
            abort(404);
        }

        return $next($request);
    }
}
