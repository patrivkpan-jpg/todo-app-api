<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TodoModel extends Model
{
    use HasFactory;

    protected $table = 'todo';

    protected $primaryKey = 'id';
    
    protected $fillable = ['label', 'description', 'duration', 'user_id', 'next_id'];

    public function prev(): HasOne
    {
        return $this->hasOne(self::class, 'next_id')->with('prev');
    }
}
