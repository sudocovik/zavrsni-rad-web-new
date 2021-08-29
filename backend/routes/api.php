<?php

use App\Http\Controllers\BoxAuthorizationAction;
use App\Http\Controllers\CardController;
use App\Http\Controllers\FetchAccessLogAction;
use App\Http\Controllers\LoginAction;
use App\Http\Controllers\LogoutAction;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', LoginAction::class);

Route::group(['middleware' => 'auth'], function() {
    Route::get('/user', fn () => response()->noContent());

    Route::get('logout', LogoutAction::class);

    Route::resource('card', CardController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('/access-log', FetchAccessLogAction::class);
});

Route::post('/box/authorize', BoxAuthorizationAction::class);
