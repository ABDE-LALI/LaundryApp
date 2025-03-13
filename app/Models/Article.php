<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'name',
        'image',
        'description',
    ];
    public function services()
    {
        return $this->belongsToMany(Service::class, 'article_service')->withPivot('price');
    }
    public function bills()
    {
        return $this->belongsToMany(Bill::class, 'orders', 'article_id', 'bill_id');
    }
}
