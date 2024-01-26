<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\TodoModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TodoController extends Controller
{
    /**
     * Display all todo items.
     */
    public function index()
    {
        $response = TodoModel::all();
        return response()->json($response, 200);
    }

    /**
     * Create a new todo item.
     */
    public function store(Request $request)
    {
        //
        $data = $request->all();
        $validator = Validator::make($data, [ 
            'label' => [
                'required',
                'max:255',
            ],
            'description' => [
                'sometimes',
                'max:255'
            ],
            'duration' => [
                'sometimes',
                'integer'
            ]
        ]);
        if ($validator->fails()) {
          return response()->json($validator->errors(), 422);
        }

        try {
            $prev = TodoModel::where('user_id', $data['user_id'])
                ->whereNull('next_id')
                ->first();
            $data['next_id'] = null;
            $response = TodoModel::create($data);
            if (empty($prev) === false) {
                TodoModel::where('id', $prev['id'])
                    ->update([
                        'next_id' => $response['id']
                    ]);
            }
            return response()->json($response, 200);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json('Something went wrong with the request.', 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified todo item.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $validator = Validator::make($data, [ 
            'label' => [
                'sometimes',
                'max:255',
            ],
            'description' => [
                'sometimes',
                'max:255'
            ],
            'duration' => [
                'sometimes',
                'integer'
            ],
            'user_id' => [
                'prohibited'
            ],
            'next_id' => [
                'prohibited'
            ]
        ]);
        if ($validator->fails()) {
          return response()->json($validator->errors(), 422);
        }

        try {
            $response = TodoModel::where('id', $id)
                ->update($data);
            return response()->json($response, 200);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json('Something went wrong with the request.', 400);
        }
    }

    /**
     * Delete the specified todo item.
     */
    public function destroy(string $id)
    {
        try {
            $item = TodoModel::where('id', $id)
                ->first();
            TodoModel::where('next_id', $id)
                ->update([
                    'next_id' => $item['next_id']
                ]);
            $response = TodoModel::destroy($id);
            return response()->json($response, 200);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json('Something went wrong with the request.', 400);
        }
    }

    /**
     * Change the order of the speecific todo item.
     */
    public function reorder(Request $request, string $id)
    {
        $data = $request->all();
        $validator = Validator::make($data, [ 
            'prev_id' => [
                'required',
                'integer',
                'exists:todo,id',
                'not_in:' . $id
            ]
        ]);
        if ($validator->fails()) {
          return response()->json($validator->errors(), 422);
        }

        try {
            $old_prev = TodoModel::where('next_id', $id)
                ->first();
            $new_prev = TodoModel::where('id', $data['prev_id'])
                ->first();
            if ($new_prev['id'] === $old_prev['id']) {
                return response()->json('Cannot reorder todo item with given the prev id.', 422);
            }
            $item = TodoModel::where('id', $id)
                ->first();
            if ($new_prev['user_id'] !== $item['user_id']) {
                return response()->json('Cannot reorder todo item with given the prev id.', 422);
            }
            TodoModel::where('id', $old_prev['id'])
                ->update([
                    'next_id' => $item['next_id']
                ]);
            TodoModel::where('id', $new_prev['id'])
                ->update([
                    'next_id' => $id
                ]);
            TodoModel::where('id', $id)
                ->update([
                    'next_id' => $new_prev['next_id']
                ]);
            return response()->json([$old_prev, $new_prev, $item], 200);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json('Something went wrong with the request.', 400);
        }
    }
}
