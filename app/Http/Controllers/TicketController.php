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
            'total_price' => 'required|numeric',
            'quantity' => 'required|integer',
            'payment_status' => 'required|in:paid,unpaid,paid_some',
            'paid_amount' => 'nullable|numeric',
        ]);

        $ticket = Ticket::create([
            'total_price' => $request->input('total_price'),
            'quantity' => $request->input('quantity'),
            'payment_status' => $request->input('payment_status'),
            'paid_amount' => $request->input('payment_status') === 'paid' 
                ? $request->input('total_price') 
                : $request->input('paid_amount', 0),
            'status' => 'pending', // Default status
        ]);

        return redirect()->back()->with('success', 'Ticket created successfully.');
    }

    public function getRecentTickets()
    {
        $tickets = Ticket::with(['orders', 'articles', 'services'])
            ->latest()
            ->take(10)
            ->get();

        return response()->json($tickets);
    }

    public function getTicket($id)
    {
        $ticket = Ticket::with(['orders', 'articles', 'services'])->find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        return response()->json($ticket);
    }

    public function setStatus($ticketId, $status)
    {
        $ticket = Ticket::find($ticketId);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        // Validate status
        $validStatuses = ['delivered', 'received'];
        if (!in_array($status, $validStatuses)) {
            return response()->json(['message' => 'Invalid status'], 400);
        }
        $ticket->payment_status = $status === 'delivered' ? 'paid' : 'unpaid';
        $ticket->status = $status;
        $ticket->save();

        return response()->json(['message' => 'Status updated successfully', 'ticket' => $ticket]);
    }
    public function updatePaidAmount(Request $request, $ticketId)
    {
        $request->validate([
            'paid_amount' => 'required|numeric',
        ]);

        $ticket = Ticket::find($ticketId);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $ticket->paid_amount = $ticket->paid_amount + $request->input('paid_amount');
        $ticket->save();

        return response()->json(['message' => 'Paid amount updated successfully', 'ticket' => $ticket]);
    }
}