<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Testing\TestResponse;

/**
 * @method TestResponse get(string $uri, array $headers = [])
 * @method TestResponse post(string $uri, array $data = [], array $headers = [])
 * @method TestResponse put(string $uri, array $data = [], array $headers = [])
 * @method TestResponse patch(string $uri, array $data = [], array $headers = [])
 * @method TestResponse delete(string $uri, array $headers = [])
 * @method TestResponse actingAs(\Illuminate\Contracts\Auth\Authenticatable $user, $guard = null)
 * @method void assertAuthenticated($guard = null)
 * @method void assertGuest($guard = null)
 */
abstract class TestCase extends BaseTestCase
{
    //
}
