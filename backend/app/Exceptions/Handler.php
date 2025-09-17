<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $levels = [
        //
    ];

    protected $dontReport = [
        //
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        //
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Unauthenticated.',
                'error' => 'unauthenticated'
            ], 401);
        }
        return parent::unauthenticated($request, $exception);
    }

    public function render($request, Throwable $e)
    {
        if ($e instanceof AuthorizationException && $request->expectsJson()) {
            return response()->json([
                'message' => 'You are not authorized to perform this action.',
                'error' => 'forbidden'
            ], 403);
        }
        return parent::render($request, $e);
    }
}
