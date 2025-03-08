<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleService extends Model
{

    protected $fillable = [
        'article_id',
        'service_id',
        'price',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
