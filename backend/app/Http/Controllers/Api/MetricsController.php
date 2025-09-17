<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class MetricsController extends Controller
{
    public function index(): Response
    {
        $lines = [];
        $now = now();
        $lines[] = '# HELP app_info Application info';
        $lines[] = '# TYPE app_info gauge';
        $lines[] = 'app_info{env="'.addslashes(app()->environment()).'"} 1';

        // APP KEY
        $lines[] = '# HELP app_key_present Whether APP_KEY is set (1=yes)';
        $lines[] = '# TYPE app_key_present gauge';
        $lines[] = 'app_key_present '.(config('app.key') ? 1 : 0);

        // DB connectivity latency (simple select 1 timing)
        $dbLatency = null; $dbOk = 0;
        $start = microtime(true);
        try {
            DB::select('select 1');
            $dbLatency = (microtime(true) - $start) * 1000; // ms
            $dbOk = 1;
        } catch (\Throwable $e) {
            $dbLatency = -1;
            $lines[] = '# DB error: '.str_replace(["\n","\r"],' ', $e->getMessage());
        }
        $lines[] = '# HELP db_up Database connectivity (1=up,0=down)';
        $lines[] = '# TYPE db_up gauge';
        $lines[] = 'db_up '.$dbOk;
        $lines[] = '# HELP db_latency_ms Database simple query latency in milliseconds (-1=error)';
        $lines[] = '# TYPE db_latency_ms gauge';
        $lines[] = 'db_latency_ms '.number_format($dbLatency, 3, '.', '');

        // Cache driver presence test
        $cacheDriver = config('cache.default');
        $cacheOk = 0; $cacheLatency = -1;
        $start = microtime(true);
        try {
            Cache::put('__metrics_ping', '1', 5);
            $cacheOk = 1;
            $cacheLatency = (microtime(true) - $start) * 1000;
        } catch (\Throwable $e) {
            $lines[] = '# Cache error: '.str_replace(["\n","\r"],' ', $e->getMessage());
        }
        $lines[] = '# HELP cache_up Cache availability';
        $lines[] = '# TYPE cache_up gauge';
        $lines[] = 'cache_up '.$cacheOk;
        $lines[] = '# HELP cache_latency_ms Cache set latency';
        $lines[] = '# TYPE cache_latency_ms gauge';
        $lines[] = 'cache_latency_ms '.number_format($cacheLatency, 3, '.', '');

        // Queue driver resolution
        $queueDriver = config('queue.default');
        $queueOk = 0;
        try { Queue::connection($queueDriver); $queueOk = 1; } catch (\Throwable $e) {}
        $lines[] = '# HELP queue_up Queue driver resolvable';
        $lines[] = '# TYPE queue_up gauge';
        $lines[] = 'queue_up '.$queueOk;

        // Timestamp
        $lines[] = '# HELP app_timestamp_seconds Current server timestamp';
        $lines[] = '# TYPE app_timestamp_seconds gauge';
        $lines[] = 'app_timestamp_seconds '.$now->timestamp;

        $body = implode("\n", $lines)."\n";
        return new Response($body, 200, ['Content-Type' => 'text/plain; version=0.0.4']);
    }
}
