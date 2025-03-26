import { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function Search() {
    const [ID, setID] = useState('');
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        getTickets();
    }, []);

    const Search = async (id) => {
        if (!id) {
            alert('Veuillez entrer un ID de commande valide.');
            return;
        }

        try {
            const response = await axios.get(`/serve/get-ticket/${id}`);
            if (response.data) {
                setTickets([response.data]); // Display only the searched ticket
            } else {
                alert('Aucun ticket trouvé avec cet ID.');
                getTickets(); // Reset to recent tickets if no ticket is found
            }
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la recherche du ticket.');
            getTickets(); // Reset to recent tickets on error
        }
    };

    const getTickets = async () => {
        // Fetch recent tickets
        try {
            const response = await axios.get('/serve/get-recent-tickets');
            setTickets(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dashboard>
            <div className="search">
                <div className="searchform">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Entrez l'ID de la commande"
                        value={ID}
                        onChange={(e) => setID(e.target.value)} // Bind input to ID state
                    />
                    <button onClick={() => Search(ID)}>Search</button>
                </div>
                <div className="recent-tickets">
                    {tickets.length === 0 ? (
                        <p>Aucun ticket trouvé.</p>
                    ) : (
                        tickets.map((ticket, index) => (
                            <div key={index} className="ticket">
                                <h4>Ticket ID: {ticket.id}</h4>
                                <p>Order Date: {ticket.created_at}</p>
                                <p>Order Status: {ticket.status}</p>
                                <p>Total Price: {ticket.total_price} DH</p>
                                <p>Paid Amount: {ticket.paid_amount} DH</p>
                                <button onClick={() => router.visit(route('serve.show', { id: ticket.id }))}>
                                    View
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Dashboard>
    );
}