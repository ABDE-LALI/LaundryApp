<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'total_price',
        'quantity',
        'payment_status',
        'paid_amount',
    ];

    // Many-to-many relationship with Article
    public function orders()
    {
        return $this->hasMany(Order::class, 'ticket_id');
    }
    public function articles()
    {
        return $this->belongsToMany(Article::class, 'orders', 'ticket_id', 'article_id');
    }

    // Many-to-many relationship with Service
    public function services()
    {
        return $this->belongsToMany(Service::class, 'orders', 'ticket_id', 'service_id');
    }
    public function getTotalPriceAttribute()
    {
        return $this->orders->sum(fn($order) => $order->price * $order->quantity);
    }
    public function getQuantityAttribute()
    {
        return $this->orders->sum('quantity');
    }
}
