<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'description',
        'image',
        'name',
    ];

    // Many-to-many relationship with Bill
    public function bills()
    {
        return $this->belongsToMany(Bill::class);
    }

    // One-to-many relationship (Service belongs to one Article)
    public function articles()
    {
        return $this->belongsToMany(Article::class, 'ArticleService')->withPivot('price');
    }
}