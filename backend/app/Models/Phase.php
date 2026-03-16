<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Phase extends Model
{
    use HasFactory;
    protected $fillable = [
        'project_id',
        'name',
        'description',
        'status',
        'estimated_hours',
        'hourly_rate',
        'order',
        'start_date',
        'end_date',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}