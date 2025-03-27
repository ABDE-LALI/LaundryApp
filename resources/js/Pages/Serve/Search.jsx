import { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { router } from "@inertiajs/react";
import axios from "axios";

// Reusable component to render a single ticket
const TicketCard = ({ ticket, showArticles = false }) => {
    return (
        <div className="ticket border rounded-lg p-4 mb-4 shadow-sm bg-white">
            <h4 className="text-lg font-semibold">Ticket ID: {ticket.id}</h4>
            <p className="text-gray-600">Date: {ticket.created_at}</p>
            <p className="text-gray-600">Status: {ticket.status}</p>
            <p className="text-gray-600">Total Price: {ticket.total_price} DH</p>
            <p className="text-gray-600">Paid Amount: {ticket.paid_amount} DH</p>

            {/* Conditionally render articles if showArticles is true (for searched ticket) */}
            {showArticles && ticket.orders && ticket.articles && (
                <div className="articles mt-4">
                    <h5 className="text-md font-medium">Articles:</h5>
                    {ticket.orders.map((order, index) => {
                        // Find the article associated with this order
                        const article = ticket.articles.find(
                            (article) => article.id === order.article_id
                        );
                        // Find the service associated with this order
                        const service = ticket.services.find(
                            (service) => service.id === order.service_id
                        );

                        if (!article) return null; // Skip if article not found

                        return (
                            <div
                                key={index}
                                className="article border-t pt-2 mt-2 text-sm text-gray-700"
                            >
                                <p>Article ID: {article.id}</p>
                                <p>Name: {article.name}</p>
                                <p>Brand: {order.brand}</p>
                                <p>Color: {order.color}</p>
                                <p>Price (unit): {order.price ? `${order.price} DH` : "N/A"}</p>
                                <p>Quantity: {order.quantity}</p>
                                <p>
                                    Service: {service ? service.name : "N/A"}
                                    {service && service.description && (
                                        <span className="text-gray-500"> ({service.description})</span>
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            <button
                onClick={() => router.visit(route("serve.show", { id: ticket.id }))}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                View Details
            </button>
        </div>
    );
};

export default function Search() {
    // State for search input, recent tickets, searched ticket, and loading
    const [searchId, setSearchId] = useState("");
    const [recentTickets, setRecentTickets] = useState([]);
    const [searchedTicket, setSearchedTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch recent tickets on component mount
    useEffect(() => {
        fetchRecentTickets();
    }, []);

    // Fetch recent tickets from the API
    const fetchRecentTickets = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/serve/get-recent-tickets");
            setRecentTickets(response.data || []);
        } catch (error) {
            console.error("Error fetching recent tickets:", error);
            alert("Erreur lors de la récupération des tickets récents.");
            setRecentTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Search for a ticket by ID
    const handleSearch = async (id) => {
        if (!id.trim()) {
            alert("Veuillez entrer un ID de commande valide.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`/serve/get-ticket/${id}`);
            if (response.data) {
                setSearchedTicket(response.data);
                console.log("Searched Ticket:", response.data);
                
            } else {
                alert("Aucun ticket trouvé avec cet ID.");
                setSearchedTicket(null);
                await fetchRecentTickets(); // Refresh recent tickets if no ticket is found
            }
        } catch (error) {
            console.error("Error searching for ticket:", error);
            alert("Erreur lors de la recherche du ticket.");
            setSearchedTicket(null);
            await fetchRecentTickets(); // Refresh recent tickets on error
        } finally {
            setIsLoading(false);
        }
    };

    // Clear the search and reset to recent tickets
    const clearSearch = () => {
        setSearchedTicket(null);
        setSearchId("");
        fetchRecentTickets();
    };

    return (
        <Dashboard>
            <div className="search p-6">
                {/* Search Form */}
                <div className="search-form mb-6 flex items-center gap-3">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Entrez l'ID de la commande"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => handleSearch(searchId)}
                        disabled={isLoading}
                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? "Recherche..." : "Rechercher"}
                    </button>
                    {searchedTicket && (
                        <button
                            onClick={clearSearch}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Afficher les tickets récents
                        </button>
                    )}
                </div>

                {/* Tickets Display */}
                <div className="recent-tickets">
                    {isLoading ? (
                        <p className="text-gray-600">Chargement...</p>
                    ) : searchedTicket ? (
                        // Display the searched ticket with articles
                        <TicketCard ticket={searchedTicket} showArticles={true} />
                    ) : recentTickets.length === 0 ? (
                        // Display message if no recent tickets
                        <p className="text-gray-600">Aucun ticket trouvé.</p>
                    ) : (
                        // Display recent tickets without articles
                        recentTickets.map((ticket, index) => (
                            <TicketCard key={index} ticket={ticket} showArticles={false} />
                        ))
                    )}
                </div>
            </div>
        </Dashboard>
    );
}