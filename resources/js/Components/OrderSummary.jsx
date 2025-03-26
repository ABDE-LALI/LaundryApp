import React from 'react';

export default function OrderSummary({
    orderItems, // Array of order items to display
    ticketId, // Ticket ID for the caption
    handleEdit, // Function to handle editing an order item
    handleDelete, // Function to handle deleting an order item
    setOrdersConf, // Function to open the confirmation modal
}) {
    return (
        <div className="order-summary">
            <h3 className="order-title text-lg font-semibold mb-2">Commandes en cours</h3>
            <div className="order-table">
                <table className="min-w-full border-collapse border border-gray-300">
                    <caption>Ticket Id: {ticketId}</caption>
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Article</th>
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Service</th>
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Prix</th>
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Quantité</th>
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Prix Total (DH)</th>
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Couleur</th>
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Marque</th>
                            <th className="border border-gray-300 px-1 py-1 text-center text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.article.name}</td>
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.service.name}</td>
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">
                                    {item.article.price ? `${item.article.price} DH` : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">x{item.quantity}</td>
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">
                                    {item.totalPrice ? `${item.totalPrice.toFixed(2)} DH` : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.color}</td>
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">{item.brand}</td>
                                <td className="border border-gray-300 px-1 py-1 text-sm text-gray-600">
                                    <button onClick={() => handleEdit(index)} className="edit-button mr-2">
                                        Modifier
                                    </button>
                                    <button onClick={() => handleDelete(index)} className="delete-button">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => setOrdersConf(true)} disabled={orderItems.length === 0}>
                    Confirm
                </button>
            </div>
        </div>
    );
}