<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use PHPUnit\Framework\Attributes\Ticket;

class Service extends Model
{
    protected $fillable = [
        'description',
        'image',
        'name',
    ];

    // Many-to-many relationship with Bill
    public function tickets()
    {
        return $this->belongsToMany(Ticket::class);
    }

    // One-to-many relationship (Service belongs to one Article)
    public function articles()
    {
        return $this->belongsToMany(Article::class, 'article_services')->withPivot('price');
    }
}