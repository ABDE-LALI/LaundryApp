import { useEffect, useState, useRef } from "react";
import Dashboard from "../Dashboard";
import axios from "axios";
import VirtualKeyboard from "@/Components/VirtualKeyboard";

const TicketCard = ({
    ticket,
    showArticles = false,
    onTicketStatusUpdate,
    onOrderStatusUpdate,
    onClick,
    onPaidAmountUpdate,
    setNotification, // Pass setNotification to update notifications from TicketCard
}) => {
    const [isEditingPaidAmount, setIsEditingPaidAmount] = useState(false);
    const [editedPaidAmount, setEditedPaidAmount] = useState(ticket.paid_amount.toString());
    const [showKeyboard, setShowKeyboard] = useState(false);
    const keyboardRef = useRef(null);

    useEffect(() => {
        if (keyboardRef.current && showKeyboard) {
            keyboardRef.current.setInput(editedPaidAmount);
        }
    }, [editedPaidAmount, showKeyboard]);

    const handlePaidAmountChange = (inputs) => {
        const value = inputs["paid_amount"] || "";
        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
            setEditedPaidAmount(value);
        }
    };

    const handleSavePaidAmount = async () => {
        const updatedAmount = parseFloat(editedPaidAmount) || 0;
        await onPaidAmountUpdate(ticket.id, updatedAmount, setNotification);
        setIsEditingPaidAmount(false);
        setShowKeyboard(false);
    };

    return (
        <div
            className="ticket bg-white shadow-lg rounded-xl p-6 border border-gray-200 cursor-pointer hover:bg-gray-50"
            onClick={() => onClick(ticket.id)}
        >
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Ticket ID: {ticket.id}</h4>
            <p className="text-gray-500">Date: {ticket.created_at}</p>
            <p className="text-gray-500">Status: {ticket.status}</p>
            <p className="text-gray-500">
                Total Price: <span className="font-medium">{ticket.total_price} DH</span>
            </p>
            <div className="text-gray-500 flex items-center gap-2">
                Paid Amount:
                {isEditingPaidAmount ? (
                    <div className="relative">
                        <input
                            type="text"
                            value={editedPaidAmount}
                            onChange={(e) => setEditedPaidAmount(e.target.value)}
                            onFocus={() => setShowKeyboard(true)}
                            className="w-24 p-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {showKeyboard && (
                            <div className="absolute top-full left-0 z-10 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                                <button
                                    onClick={() => setShowKeyboard(false)}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    style={{ width: "24px", height: "24px" }}
                                >
                                    ×
                                </button>
                                <VirtualKeyboard
                                    keyboardRef={keyboardRef}
                                    onChangeAll={handlePaidAmountChange}
                                    inputName="paid_amount"
                                    initialLayout="numeric"
                                />
                            </div>
                        )}
                        <button
                            onClick={handleSavePaidAmount}
                            className="ml-2 px-2 py-1 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <>
                        <span className="font-medium">{ticket.paid_amount} DH</span>
                        {showArticles && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditingPaidAmount(true);
                                }}
                                className="ml-2 px-6 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                            >
                                Edit
                            </button>
                        )}
                    </>
                )}
            </div>
            {(ticket.total_price - ticket.paid_amount) >= 0 ? (
                <p className="text-gray-500">
                    Rest: <span className="font-medium">{ticket.total_price - ticket.paid_amount} DH</span>
                </p>
            ) : (
                <p className="text-gray-500">
                    Back: <span className="font-medium">{(ticket.total_price - ticket.paid_amount) * -1} DH</span>
                </p>
            )}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTicketStatusUpdate(ticket.id, "delivered");
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
                >
                    Mark as Delivered
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTicketStatusUpdate(ticket.id, "received");
                    }}
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
                                <p>
                                    <strong>{article.name}</strong> (Brand: {order.brand})
                                </p>
                                <p>Color: {order.color}</p>
                                <p>
                                    Price: {order.price ? `${order.price} DH` : "N/A"} | Quantity: {order.quantity}
                                </p>
                                <p>Service: {service ? service.name : "N/A"}</p>
                                <p>Status: {order.order_status}</p>
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOrderStatusUpdate(order.id, "delivered");
                                        }}
                                        className="px-3 py-1 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600"
                                    >
                                        Delivered
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOrderStatusUpdate(order.id, "received");
                                        }}
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
    const [notification, setNotification] = useState(null); // New state for notifications
    const keyboardRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchRecentTickets();
    }, []);

    useEffect(() => {
        if (keyboardRef.current && showKeyboard) {
            keyboardRef.current.setInput(searchId);
        }
    }, [searchId, showKeyboard]);

    const fetchRecentTickets = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/serve/get-recent-tickets");
            setRecentTickets(response.data || []);
        } catch (error) {
            console.error("Error fetching recent tickets:", error);
            setNotification({ type: "error", message: "Erreur lors de la récupération des tickets récents." });
            setTimeout(() => setNotification(null), 3000); // Auto-dismiss after 3 seconds
            setRecentTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (id) => {
        if (!(id + " ").trim()) {
            setNotification({ type: "error", message: "Veuillez entrer un ID de ticket valide." });
            setTimeout(() => setNotification(null), 3000);
            return;
        }

        setIsLoading(true);
        setShowKeyboard(false);
        try {
            const response = await axios.get(`/serve/get-ticket/${id}`);
            if (response.data) {
                setSearchedTicket(response.data);
            } else {
                setNotification({ type: "error", message: "Aucun ticket trouvé avec cet ID." });
                setTimeout(() => setNotification(null), 3000);
                setSearchedTicket(null);
                await fetchRecentTickets();
            }
        } catch (error) {
            console.error("Error searching for ticket:", error);
            setNotification({ type: "error", message: "Erreur lors de la recherche du ticket." });
            setTimeout(() => setNotification(null), 3000);
            setSearchedTicket(null);
            await fetchRecentTickets();
        } finally {
            setIsLoading(false);
        }
    };

    const setOrderStatus = async (orderId, status) => {
        setIsLoading(true);
        try {
            await axios.put(`/serve/set-order-status/${orderId}/${status}`).then(() => {
                setNotification({ type: "success", message: "Statut mis à jour avec succès." });
                setTimeout(() => setNotification(null), 3000);
                if (searchedTicket) {
                    handleSearch(searchedTicket.id);
                } else {
                    fetchRecentTickets();
                }
            });
        } catch (error) {
            console.error("Error updating status:", error);
            setNotification({
                type: "error",
                message: error.response?.data?.message || "Échec de la mise à jour du statut.",
            });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const setTicketStatus = async (ticketId, status) => {
        setIsLoading(true);
        try {
            await axios.put(`/serve/set-ticket-status/${ticketId}/${status}`).then(() => {
                setNotification({ type: "success", message: "Statut du ticket mis à jour avec succès." });
                setTimeout(() => setNotification(null), 3000);
                searchedTicket ? handleSearch(ticketId) : fetchRecentTickets();
            });
        } catch (error) {
            console.error("Error updating status:", error);
            setNotification({
                type: "error",
                message: error.response?.data?.message || "Échec de la mise à jour du statut du ticket.",
            });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const updatePaidAmount = async (ticketId, newPaidAmount, setNotification) => {
        setIsLoading(true);
        try {
            await axios.put(`/serve/update-paid-amount/${ticketId}`, { paid_amount: newPaidAmount }).then(() => {
                setNotification({ type: "success", message: "Montant payé mis à jour avec succès." });
                setTimeout(() => setNotification(null), 3000);
                if (searchedTicket) {
                    handleSearch(ticketId);
                } else {
                    fetchRecentTickets();
                }
            });
        } catch (error) {
            console.error("Error updating paid amount:", error);
            setNotification({
                type: "error",
                message: error.response?.data?.message || "Échec de la mise à jour du montant payé.",
            });
            setTimeout(() => setNotification(null), 3000);
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

    const handleKeyPress = (button) => {
        if (button === "{enter}") {
            handleSearch(searchId);
        } else if (button === "{bksp}") {
            setSearchId((prev) => prev.slice(0, -1));
        }
    };

    const handleTicketClick = (ticketId) => {
        handleSearch(ticketId);
    };

    // Styled Notification Component
    const Notification = ({ type, message }) => (
        <div className="fixed top-4 right-4 z-70">
            <div
                className={`p-4 rounded-lg shadow-lg text-white flex items-center gap-2 animate-fade-in ${
                    type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
            >
                <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    );

    return (
        <Dashboard>
            <div className="search p-6 w-full mx-auto">
                <div className="search-form mb-6 flex gap-3 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="Search by Ticket ID"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handleSearch(searchId)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Search
                    </button>
                    <button
                        onClick={clearSearch}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Clear
                    </button>
                    {showKeyboard && (
                        <div className="absolute top-full left-0 z-10 mt-2 w-[25vw] max-w-2xl bg-white shadow-lg rounded-lg p-4">
                            <button
                                onClick={() => setShowKeyboard(false)}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                style={{ width: "32px", height: "32px" }}
                            >
                                ×
                            </button>
                            <VirtualKeyboard
                                keyboardRef={keyboardRef}
                                onChangeAll={handleKeyboardChange}
                                onKeyPress={handleKeyPress}
                                inputName="searchId"
                                initialLayout="numeric"
                            />
                        </div>
                    )}
                </div>

                <div className="recent-tickets overflow-y-auto h-max-[85vh] h-[85vh] space-y-4">
                    {isLoading ? (
                        <p className="text-gray-600 text-center">Loading...</p>
                    ) : searchedTicket ? (
                        <TicketCard
                            ticket={searchedTicket}
                            showArticles={true}
                            onOrderStatusUpdate={setOrderStatus}
                            onTicketStatusUpdate={setTicketStatus}
                            onClick={() => {}}
                            onPaidAmountUpdate={updatePaidAmount}
                            setNotification={setNotification} // Pass setNotification to TicketCard
                        />
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
                                onClick={handleTicketClick}
                                onPaidAmountUpdate={updatePaidAmount}
                                setNotification={setNotification} // Pass setNotification to TicketCard
                            />
                        ))
                    )}
                </div>

                {/* Notification */}
                {notification && (
                    <Notification type={notification.type} message={notification.message} />
                )}
            </div>
        </Dashboard>
    );
}