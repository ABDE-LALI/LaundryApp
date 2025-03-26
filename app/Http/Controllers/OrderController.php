<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Order;
use App\Models\Service;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // Determine the database connection based on environment or request
        $connection = config('database.default'); // 'sqlite' for offline, 'mysql' for online
        // Optionally, check if running in Electron offline mode (custom logic needed)
        // For now, assume dynamic switching isn't implemented yet; adjust based on your setup

        $articles = Article::on($connection)->with('services')->get();
        $services = Service::on($connection)->get();
        $ticket_id = Ticket::on($connection)->max('id') + 1;
        return Inertia::render('Serve/Create', [
            'articles' => Article::with('services')->get(),
            'services' => Service::all(),
            'ticket_id' => $ticket_id,
        ]);
    }
    // public function storeTicket(Request $request)
    // {
    //     $ticket = Ticket::create([
    //         // Add any required fields, e.g., user_id, status
    //         'total_price' => 0,
    //         'quantity' => 0,
    //     ]);

    //     return response()->json(['ticket_id' => $ticket->id], 201);
    // }
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'items' => 'required|array',
            'items.*.ticket_id' => 'required|integer|min:1',
            'items.*.article_id' => 'required|exists:articles,id',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|integer|min:0',
            'items.*.brand' => 'nullable|string',
            'items.*.color' => 'nullable|string',
        ]);

        // Loop through items and store them
        foreach ($request->input('items') as $item) {
            Order::create([
                'ticket_id' => $item['ticket_id'],
                'article_id' => $item['article_id'],
                'service_id' => $item['service_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'brand' => $item['brand'] ?? null,
                'color' => $item['color'] ?? null,
            ]);
        }

        // Return a success response (Inertia will handle it)
        return redirect()->back()->with('message', 'Commandes soumises avec succès !');
    }
    // public function store(Request $request)
    // {
    //     // Determine the database connection based on environment or request
    //     $connection = config('database.default'); // 'sqlite' for offline, 'mysql' for online
    //     // Optionally, check if running in Electron offline mode (custom logic needed)
    //     // For now, assume dynamic switching isn't implemented yet; adjust based on your setup
    //     echo $request;
    //     $order = new Order();
    //     $order->ticket_id = $request->ticket_id;
    //     $order->article_id = $request->article_id;
    //     $order->service_id = $request->service_id;
    //     $order->quantity = $request->quantity;
    //     $order->price = $request->price;
    //     $order->brand = $request->brand;
    //     $order->color = $request->color;
    //     $order->save();

    //     return redirect()->route('serve.create');
    // }
}
