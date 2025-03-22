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
        ]);
        // return $request->input('total_price');
         $ticket = Ticket::create([
            // Add any required fields, e.g., user_id, status
            'total_price' => $request->input('total_price'),
            'quantity' => $request->input('quantity'),
        ]);
    }
}
