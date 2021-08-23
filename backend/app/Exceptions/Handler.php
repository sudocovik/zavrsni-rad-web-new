<?php

namespace App\Exceptions;

use App\Models\Card;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        InvalidCredentialsException::class
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof AuthenticationException) {
            return response()->json(['message' => 'Niste prijavljeni.'], 401);
        }

        if ($exception instanceof InvalidCredentialsException) {
            return response()->json(['message' => 'Korisničko ime i/ili lozinka su ne ispravni.'], 401);
        }

        if ($exception instanceof ValidationException) {
            return response()->json([
                'errors' => $exception->errors(),
                'message' => 'Dani podaci nisu ispravni.'
            ], $exception->status);
        }

        if ($exception instanceof ModelNotFoundException && $exception->getModel() === Card::class) {
            return response()->json(['message' => 'Kartica ne postoji.'], 404);
        }

        return parent::render($request, $exception);
    }
}
