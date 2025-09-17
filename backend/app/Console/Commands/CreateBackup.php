<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\BackupController;
use Illuminate\Http\Request;

class CreateBackup extends Command
{
    protected $signature = 'backup:create';
    protected $description = 'Create a website backup via BackupController logic';

    public function handle(): int
    {
        $controller = new BackupController();
        $response = $controller->create(new Request());
        $data = $response->getData(true);
        $this->info(json_encode($data, JSON_PRETTY_PRINT));
        return $data['success'] ? Command::SUCCESS : Command::FAILURE;
    }
}
