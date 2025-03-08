<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    protected $fillable = ['bill_id', 'article_id', 'service_id', 'quantity', 'price'];

    public function bill()
    {
        return $this->belongsTo(Bill::class, 'bill_id');
    }
    public function article()
    {
        return $this->belongsTo(Article::class);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
