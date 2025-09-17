<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Throwable;

class SelfTest extends Command
{
    protected $signature = 'app:self-test {--json : Output JSON for monitoring}';
    protected $description = 'Run internal health diagnostics (app key, db, cache, queue)';

    public function handle(): int
    {
        $results = [
            'app_key' => config('app.key') ? 'ok' : 'missing',
            'env' => app()->environment(),
            'time' => now()->toIso8601String(),
        ];

        // DB
        try {
            DB::select('select 1');
            $results['db'] = 'ok';
        } catch (Throwable $e) {
            $results['db'] = 'error';
            $results['db_error'] = $e->getMessage();
        }

        // Cache
        $cacheDriver = config('cache.default');
        $results['cache_driver'] = $cacheDriver;
        try {
            Cache::put('__selftest', '1', 5);
            $results['cache'] = 'ok';
        } catch (Throwable $e) {
            $results['cache'] = 'error';
            $results['cache_error'] = $e->getMessage();
        }

        // Queue (driver existence + fake push)
        $queueConnection = config('queue.default');
        $results['queue_driver'] = $queueConnection;
        try {
            // We don't actually dispatch a job (side effects) just ensure driver resolves
            Queue::connection($queueConnection);
            $results['queue'] = 'ok';
        } catch (Throwable $e) {
            $results['queue'] = 'error';
            $results['queue_error'] = $e->getMessage();
        }

        $exit = 0;
        foreach (['app_key','db','cache','queue'] as $key) {
            if (($results[$key] ?? 'ok') !== 'ok') { $exit = 1; }
        }

        if ($this->option('json')) {
            $this->line(json_encode($results));
        } else {
            foreach ($results as $k => $v) {
                $this->line(str_pad($k, 14) . ': ' . $v);
            }
            $this->line('exit_status    : ' . $exit);
        }

        return $exit;
    }
}
