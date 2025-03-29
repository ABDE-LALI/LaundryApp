import { useEffect, useState, useRef } from "react";
import Dashboard from "../Dashboard";
import axios from "axios";
import VirtualKeyboard from "@/Components/VirtualKeyboard"; // Adjust the path based on your project structure

const TicketCard = ({ ticket, showArticles = false, onTicketStatusUpdate, onOrderStatusUpdate }) => {
    return (
        <div className="ticket bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Ticket ID: {ticket.id}</h4>
            <p className="text-gray-500">Date: {ticket.created_at}</p>
            <p className="text-gray-500">Status: {ticket.status}</p>
            <p className="text-gray-500">Total Price: <span className="font-medium">{ticket.total_price} DH</span></p>
            <p className="text-gray-500">Paid Amount: <span className="font-medium">{ticket.paid_amount} DH</span></p>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={() => onTicketStatusUpdate(ticket.id, "delivered")}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
                >
                    Mark as Delivered
                </button>
                <button
                    onClick={() => onTicketStatusUpdate(ticket.id, "received")}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    Mark as Received
                </button>
            </div>

            {showArticles && ticket.orders && ticket.articles && (
                <div className="mt-6 border-t pt-4">
                    <h5 className="text-md font-medium text-gray-800 mb-2">Articles</h5>
                    {ticket.orders.map((order, index) => {
                        const article = ticket.articles.find((a) => a.id === order.article_id);
                        const service = ticket.services.find((s) => s.id === order.service_id);

                        if (!article) return null;

                        return (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm mt-2">
                                <p><strong>{article.name}</strong> (Brand: {order.brand})</p>
                                <p>Color: {order.color}</p>
                                <p>Price: {order.price ? `${order.price} DH` : "N/A"} | Quantity: {order.quantity}</p>
                                <p>Service: {service ? service.name : "N/A"}</p>
                                <p>Status: {order.order_status}</p>
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={() => onOrderStatusUpdate(order.id, "delivered")}
                                        className="px-3 py-1 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600"
                                    >
                                        Delivered
                                    </button>
                                    <button
                                        onClick={() => onOrderStatusUpdate(order.id, "received")}
                                        className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                    >
                                        Received
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default function Search() {
    const [searchId, setSearchId] = useState("");
    const [recentTickets, setRecentTickets] = useState([]);
    const [searchedTicket, setSearchedTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const keyboardRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchRecentTickets();
    }, []);

    useEffect(() => {
        // Sync the keyboard's internal state with the searchId state
        if (keyboardRef.current) {
            keyboardRef.current.setInput(searchId, "searchId");
        }
    }, [searchId]);

    const fetchRecentTickets = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/serve/get-recent-tickets");
            setRecentTickets(response.data || []);
        } catch (error) {
            console.error("Error fetching recent tickets:", error);
            alert("Error fetching recent tickets.");
            setRecentTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (id) => {
        if (!(id + " ").trim()) {
            alert("Please enter a valid ticket ID.");
            return;
        }

        setIsLoading(true);
        setShowKeyboard(false);
        try {
            const response = await axios.get(`/serve/get-ticket/${id}`);
            if (response.data) {
                setSearchedTicket(response.data);
            } else {
                alert("No ticket found with this ID.");
                setSearchedTicket(null);
                await fetchRecentTickets();
            }
        } catch (error) {
            console.error("Error searching for ticket:", error);
            alert("Error searching for ticket.");
            setSearchedTicket(null);
            await fetchRecentTickets();
        } finally {
            setIsLoading(false);
        }
    };

    const setOrderStatus = async (orderId, status) => {
        setIsLoading(true);
        try {
            await axios.put(`/serve/set-order-status/${orderId}/${status}`)
                .then(() => {
                    alert("Status updated successfully.");
                    if (searchedTicket) {
                        handleSearch(searchedTicket.id);
                    } else {
                        fetchRecentTickets();
                    }
                })
                .catch((error) => {
                    console.error("Error updating status:", error);
                    alert(error.response?.data?.message || "Failed to update status.");
                });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status.");
        } finally {
            setIsLoading(false);
        }
    };
    const setTicketStatus = async (ticketId, status) => {
        setIsLoading(true);
        try {
            await axios.put(`/serve/set-ticket-status/${ticketId}/${status}`)
                .then(() => {
                    alert("Ticket Status updated successfully.");
                    fetchRecentTickets();
                })
                .catch((error) => {
                    console.error("Error updating status:", error);
                    alert(error.response?.data?.message || "Failed to update the ticket status.");
                });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating ticket status.");
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchedTicket(null);
        setSearchId("");
        fetchRecentTickets();
        setShowKeyboard(false);
    };

    const handleKeyboardChange = (inputs) => {
        setSearchId(inputs.searchId || "");
    };

    const handleInputFocus = () => {
        setShowKeyboard(true);
    };

    const handleInputBlur = () => {
        // Uncomment if you want the keyboard to hide on blur
        // setShowKeyboard(false);
    };

    const handleKeyPress = (button) => {
        if (button === "{enter}") {
            handleSearch(searchId);
        } else if (button === "{bksp}") {
            // Handle backspace explicitly
            setSearchId((prev) => prev.slice(0, -1));
        }
    };

    return (
        <Dashboard>
            <div className="search p-8 max-w-4xl mx-auto">
                <div className="search-form mb-6 flex gap-3 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        name="searchId"
                        placeholder="Enter Ticket ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        readOnly
                        className="border rounded-lg px-4 py-2 w-64 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handleSearch(searchId)}
                        disabled={isLoading}
                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        aria-label="Search for ticket by ID"
                    >
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                    {searchedTicket && (
                        <button
                            onClick={clearSearch}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            aria-label="Show recent tickets"
                        >
                            Show Recent Tickets
                        </button>
                    )}
                    {showKeyboard && (
                        <div className="absolute top-14 left-0 z-10 w-full max-w-md">
                            <VirtualKeyboard
                                keyboardRef={keyboardRef}
                                onChangeAll={handleKeyboardChange}
                                onKeyPress={handleKeyPress}
                                initialLayout="numeric"
                                inputName="searchId"
                            />
                        </div>
                    )}
                </div>

                <div className="recent-tickets">
                    {isLoading ? (
                        <p className="text-gray-600 text-center">Loading...</p>
                    ) : searchedTicket ? (
                        <TicketCard ticket={searchedTicket} showArticles={true} onOrderStatusUpdate={setOrderStatus} onTicketStatusUpdate={setTicketStatus} />
                    ) : recentTickets.length === 0 ? (
                        <p className="text-gray-600 text-center">No tickets found.</p>
                    ) : (
                        recentTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                showArticles={false}
                                onTicketStatusUpdate={setTicketStatus}
                                onOrderStatusUpdate={setOrderStatus}
                            />
                        ))
                    )}
                </div>
            </div>
        </Dashboard>
    );
}