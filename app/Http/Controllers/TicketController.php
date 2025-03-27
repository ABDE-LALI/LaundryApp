<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::all();
        return view('tickets.index', compact('tickets'));
    }
    public function storeTicket(Request $request)
    {
        $request->validate([
            'total_price' => 'required',
            'quantity' => 'required',
            'payment_status' => 'required',
        ]);
         $ticket = Ticket::create([
            // Add any required fields, e.g., user_id, status
            'total_price' => $request->input('total_price'),
            'quantity' => $request->input('quantity'),
            'payment_status' => $request->input('payment_status'),
            'paid_amount' => $request->input('payment_status') === 'paid'? $request->input('total_price') : $request->input('paid_amount'),
        ]);
    }
    public function getRecentTickets()
{
    $tickets = Ticket::with('orders') // Eager load orders
        ->latest()
        ->take(9)
        ->get();
    // echo $tickets;
    return response()->json($tickets);
}
public function getTicket($id)
{

    $ticket = Ticket::with('orders')->with('articles')->with('services')->find($id);
    return response()->json($ticket);

}

}