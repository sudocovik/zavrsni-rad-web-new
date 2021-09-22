<?php

namespace App\Providers;

use App\Events\BoxAccessWasGranted;
use App\Events\BoxAccessWasProhibited;
use App\Listeners\LogGrantedBoxAccess;
use App\Listeners\LogProhibitedBoxAccess;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        BoxAccessWasGranted::class => [
            LogGrantedBoxAccess::class
        ],

        BoxAccessWasProhibited::class => [
            LogProhibitedBoxAccess::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
