<?php

namespace App\Http\Controllers;

use App\Exceptions\InvalidCredentialsException;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LoginAction extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws InvalidCredentialsException
     */
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $input = $request->validated();

        $username = $input['username'];
        $password = $input['password'];

        if (Auth::attempt(['username' => $username, 'password' => $password]) === false) {
            throw new InvalidCredentialsException;
        }

        return response()->json(['data' => 'Uspješna prijava']);
    }
}
