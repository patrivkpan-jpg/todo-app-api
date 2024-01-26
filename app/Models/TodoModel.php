<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TodoModel extends Model
{
    use HasFactory;

    protected $table = 'todo';

    protected $primaryKey = 'id';
    
    protected $fillable = ['label', 'description', 'duration', 'user_id', 'next_id'];
}
