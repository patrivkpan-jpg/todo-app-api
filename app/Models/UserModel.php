<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserModel extends Model
{
    use HasFactory;

    protected $table = 'user';

    protected $primaryKey = 'id';
    
    protected $fillable = ['name', 'username', 'password', 'root_task_id'];

    public function rootTask(): HasOne
    {
        return $this->hasOne(TodoModel::class, 'id');
    }
}
