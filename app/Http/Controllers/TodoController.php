<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\TodoModel;
use App\Models\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    /**
     * Display all tasks.
     */
    public function index(Request $request)
    {
        $data = $request->all();
        $query = TodoModel::with('prev');
        if (isset($data['user_id']) === true) {
            $query->where('user_id', $data['user_id'])
                ->whereNull('next_id');
        }
        $response = $this->sortTodo($query->first()->toArray());
        return response()->json(parent::response('SUCCESS', 'Successfully retrieved todo items.', $response), 200);
    }

    /**
     * Sorts the todo list in order.
     */
    private function sortTodo($todo)
    {
        $prev = array_merge([], $todo['prev']);
        unset($todo['prev']);
        $sorted[] = $todo;
        while (empty($prev) === false) {
            $old_prev = array_merge([], $prev);
            unset($old_prev['prev']);
            $sorted[] = $old_prev;
            $prev = array_merge([], $prev['prev'] ?? []);
        }
        return array_reverse($sorted);
    }

    /**
     * Create a new task.
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
          return response()->json(parent::response('FAIL', 'Validation failed.', $validator->errors()), 422);
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
            } else {
                UserModel::find($data['user_id'])
                    ->update(
                        ['root_task_id' => $response['id']]
                    );
            }
            return response()->json(parent::response('SUCCESS', 'Successfully created new todo item.', $response), 200);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json(parent::response('FAIL', 'Something went wrong with the request.'), 400);
        }
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $validationData = array_merge($data, [
            'id' => $id
        ]);
        $validator = Validator::make($validationData, [ 
            'id' => [
                'required',
                'integer',
                'exists:todo',
            ],
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
            return response()->json(parent::response('FAIL', 'Validation failed.', $validator->errors()), 422);
        }

        try {
            TodoModel::where('id', $id)
                ->update($data);
            return response()->json(parent::response('SUCCESS', 'Successfully updated todo item.', $this->get($id)), 200);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json(parent::response('FAIL', 'Something went wrong with the request.'), 400);
        }
    }

    /**
     * Get a task by id.
     */
    private function get(string $id)
    {
        return TodoModel::find($id);
    }

    /**
     * Delete the specified task.
     */
    public function destroy(string $id)
    {
        $validator = Validator::make(['id' => $id], [ 
            'id' => [
                'required',
                'integer',
                'exists:todo',
            ]
        ]);
        if ($validator->fails()) {
            return response()->json(parent::response('FAIL', 'Validation failed.', $validator->errors()), 422);
        }

        try {
            $item = TodoModel::where('id', $id)
                ->first();
            TodoModel::where('next_id', $id)
                ->update([
                    'next_id' => $item['next_id']
                ]);
            UserModel::where('id', $item['user_id'])
                ->where('root_task_id', $id)
                ->update([
                    'root_task_id' => $item['next_id']
                ]);
            TodoModel::destroy($id);
            return response()->json(parent::response('SUCCESS', 'Successfully deleted todo item.'), 200);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json(parent::response('FAIL', 'Something went wrong with the request.'), 400);
        }
    }

    /**
     * Change the order of the speecific task.
     */
    public function reorder(Request $request, string $id)
    {
        $data = $request->all();
        $validator = Validator::make($data, [ 
            'prev_id' => [
                'sometimes',
                'integer',
                'exists:todo,id',
                'not_in:' . $id
            ]
        ]);
        if ($validator->fails()) {
            return response()->json(parent::response('FAIL', 'Validation failed.', $validator->errors()), 422);
        }

        try {
            $prev_id = $data['prev_id'] ?? null;
            $old_prev = TodoModel::where('next_id', $id)
                ->first();
            $task = TodoModel::where('id', $id)
                ->first();
            if (isset($prev_id) === true) {
                return $this->reorderNormally($old_prev, $task, $prev_id, $id);
            }
            return $this->reorderToRoot($old_prev, $task, $id);
        } catch (Exception $e) {
            Log::info($e->getMessage());
            return response()->json(parent::response('FAIL', 'Something went wrong with the request.'), 400);
        }
    }

    /**
     * Move task to root.
     */
    private function reorderToRoot($old_prev, $task, string $id)
    {
        $user = UserModel::where('id', $task['user_id'])
            ->first();
        if ((int)$id === $user['root_task_id']) {
            return response()->json(parent::response('FAIL', 'Id is already the root task id.'), 422);
        }

        TodoModel::where('id', $old_prev['id'] ?? 0)
            ->update([
                'next_id' => $task['next_id']
        ]);
        TodoModel::where('id', $id)
            ->update([
                'next_id' => $user['root_task_id']
        ]);
        UserModel::where('id', $task['user_id'])
            ->where('root_task_id', $user['root_task_id'])
            ->update([
                'root_task_id' => $id
        ]);

        return response()->json(parent::response('SUCCESS', 'Successfully reordered todo item.', $this->get($id)), 200);
    }

    /**
     * Move task to anywhere other than root
     */
    private function reorderNormally($old_prev, $task, string $prev_id, string $id)
    {
        $new_prev = TodoModel::where('id', $prev_id)
            ->first();
        if (isset($old_prev) === true && $new_prev['id'] === $old_prev['id']) {
            return response()->json(parent::response('FAIL', 'Id of new prev should not be the same as id of old prev.'), 422);
        }
        if ($new_prev['user_id'] !== $task['user_id']) {
            return response()->json(parent::response('FAIL', 'User id of the new prev should be the same as the user id of reordered todo item.'), 422);
        }

        TodoModel::where('id', $old_prev['id'] ?? 0)
            ->update([
                'next_id' => $task['next_id']
            ]);
        TodoModel::where('id', $new_prev['id'])
            ->update([
                'next_id' => $id
            ]);
        TodoModel::where('id', $id)
            ->update([
                'next_id' => $new_prev['next_id']
            ]);

        UserModel::where('id', $task['user_id'])
            ->where('root_task_id', $id)
            ->update([
                'root_task_id' => $task['next_id']
        ]);

        return response()->json(parent::response('SUCCESS', 'Successfully reordered todo item.', $this->get($id)), 200);
    }
}
