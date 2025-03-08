<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'name',
        'image',
        'description',
        // 'p_wash',
        // 'p_dry',
        // 'p_wash_iron',
        // 'p_dry_iron',
        // 'p_iron',
        // 'p_paint_black',
        // 'p_paint_color',
    ];
    public function services()
    {
        return $this->belongsToMany(Service::class, 'ArticleService')->withPivot('price');
    }
    public function bills()
    {
        return $this->belongsToMany('App\Models\bill');
    }
}
