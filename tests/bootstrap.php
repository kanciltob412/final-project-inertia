<?php

// Load Composer autoload first
require __DIR__ . '/../vendor/autoload.php';

// If an environment file for testing exists, load it. Otherwise set minimal env vars.
if (file_exists(__DIR__ . '/../.env.testing')) {
    // Load variables from .env.testing into $_ENV
    $lines = file(__DIR__ . '/../.env.testing', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) {
            continue;
        }
        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        putenv(trim($key) . '=' . trim($value));
        $_ENV[trim($key)] = trim($value);
        $_SERVER[trim($key)] = trim($value);
    }
}

// Ensure APP_KEY is set for the test environment; generate a base64 key if missing
if (empty(getenv('APP_KEY')) && empty($_ENV['APP_KEY'])) {
    $key = 'base64:' . base64_encode(random_bytes(32));
    putenv('APP_KEY=' . $key);
    $_ENV['APP_KEY'] = $key;
    $_SERVER['APP_KEY'] = $key;
}

// Ensure database uses in-memory sqlite for tests if not already set
if (empty(getenv('DB_CONNECTION')) && empty($_ENV['DB_CONNECTION'])) {
    putenv('DB_CONNECTION=sqlite');
    $_ENV['DB_CONNECTION'] = 'sqlite';
    $_SERVER['DB_CONNECTION'] = 'sqlite';
}

if ((empty(getenv('DB_DATABASE')) && empty($_ENV['DB_DATABASE'])) || getenv('DB_DATABASE') === '') {
    putenv('DB_DATABASE=:memory:');
    $_ENV['DB_DATABASE'] = ':memory:';
    $_SERVER['DB_DATABASE'] = ':memory:';
}

// Set APP_ENV to testing
putenv('APP_ENV=testing');
$_ENV['APP_ENV'] = 'testing';
$_SERVER['APP_ENV'] = 'testing';
