<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $value = (string) $value;
        $tests = [
            'min' => fn() => strlen($value) >= 10,
            'upper' => fn() => preg_match('/[A-Z]/', $value),
            'lower' => fn() => preg_match('/[a-z]/', $value),
            'digit' => fn() => preg_match('/\d/', $value),
            'symbol' => fn() => preg_match('/[^A-Za-z0-9]/', $value),
        ];
        foreach ($tests as $key => $ok) {
            if (!$ok()) {
                $fail('The :attribute must contain at least 10 chars including uppercase, lowercase, digit and symbol.');
                return;
            }
        }
    }
}
