<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class HealthCheckController extends Controller
{
    public function index(): JsonResponse
    {
        $status = [
            'app' => 'ok',
            'timestamp' => now()->toIso8601String(),
        ];

        // Check APP_KEY presence
        $status['app_key'] = config('app.key') ? 'set' : 'missing';

        // Basic DB connectivity
        try {
            DB::connection()->select('select 1');
            $status['db'] = 'ok';
        } catch (\Throwable $e) {
            $status['db'] = 'error';
            $status['db_error'] = $e->getCode();
        }

        // Queue (just reports default connection driver)
        $status['queue'] = config('queue.default');

        // Cache driver quick ping (only if redis or memcached, otherwise skip) 
        $cacheDriver = config('cache.default');
        $status['cache'] = $cacheDriver;
        if (in_array($cacheDriver, ['redis', 'memcached'])) {
            try {
                Cache::put('__healthcheck', '1', 5);
                $status['cache_status'] = 'ok';
            } catch (\Throwable $e) {
                $status['cache_status'] = 'error';
            }
        }

        $httpCode = ($status['db'] ?? null) === 'error' || ($status['app_key'] ?? null) === 'missing' ? 503 : 200;
        return response()->json($status, $httpCode);
    }
}
