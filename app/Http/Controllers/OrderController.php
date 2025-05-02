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
    public function setStatus($orderId, $status)
    {
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['errors' => ['order' => 'Ticket not found']], 422);
        }

        // Validate status (example)
        $validStatuses = ['received', 'delivered'];
        if (!in_array($status, $validStatuses)) {
            return response()->json(['errors' => ['status' => 'Invalid status value']], 422);
        }

        $order->order_status = $status;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully']);
    }
    public function getStatistics()
    {
        $totalTickets = Ticket::count();
        $totalOrders = Order::count();
        $paidTickets = Ticket::where('payment_status', 'paid')->count();
        $unpaidTickets = Ticket::where('payment_status', 'unpaid')->count();
        $ticketStatusData = Ticket::selectRaw('status, COUNT(*) as value')
            ->groupBy('status')
            ->get()
            ->map(fn($item) => ['name' => ucfirst($item->status), 'value' => $item->value]);
        $paymentStatusData = Ticket::selectRaw('payment_status, COUNT(*) as value')
            ->groupBy('payment_status')
            ->get()
            ->map(fn($item) => ['name' => ucfirst($item->payment_status), 'value' => $item->value]);

        $stats = compact(
            'totalTickets',
            'totalOrders',
            'paidTickets',
            'unpaidTickets',
            'ticketStatusData',
            'paymentStatusData'
        );

        return Inertia::render('Serve/Statistics', [
            'stats' => $stats,
        ]);
    }

    // For /serve/statistics-data - Returns JSON for dynamic updates
    public function getStatisticsJson()
    {
        $totalTickets = Ticket::count();
        $totalOrders = Order::count();
        $paidTickets = Ticket::where('payment_status', 'paid')->count();
        $unpaidTickets = Ticket::where('payment_status', 'unpaid')->count();
        $ticketStatusData = Ticket::selectRaw('status, COUNT(*) as value')
            ->groupBy('status')
            ->get()
            ->map(fn($item) => ['name' => ucfirst($item->status), 'value' => $item->value]);
        $paymentStatusData = Ticket::selectRaw('payment_status, COUNT(*) as value')
            ->groupBy('payment_status')
            ->get()
            ->map(fn($item) => ['name' => ucfirst($item->payment_status), 'value' => $item->value]);

        return response()->json(compact(
            'totalTickets',
            'totalOrders',
            'paidTickets',
            'unpaidTickets',
            'ticketStatusData',
            'paymentStatusData'
        ));
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

