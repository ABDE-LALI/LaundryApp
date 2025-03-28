<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use PHPUnit\Framework\Attributes\Ticket;

class Order extends Model
{
    protected $fillable = ['ticket_id', 'article_id', 'service_id', 'quantity', 'price', 'brand', 'color', 'order_status'];

    public function bill()
    {
        return $this->belongsTo(Ticket::class, 'bill_id');
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
