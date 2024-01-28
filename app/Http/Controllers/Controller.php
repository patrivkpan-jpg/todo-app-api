<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public static function response(string $status, string $message, $data = [])
    {
        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        ];
    }
}
