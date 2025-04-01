import React from "react";

export default function OrderSummary({
    orderItems,
    ticketId,
    handleEdit,
    handleDelete,
    setOrdersConf,
}) {
    // Calculate total bill price
    const totalBillPrice = orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

    return (
        <div className="order-summary bg-white p-6 shadow-md rounded-lg border border-gray-200 mt-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Commandes en cours</h3>
            <div className="order-table">
                <table className="min-w-full border-collapse">
                    <caption className="text-sm text-gray-600 mb-2">Ticket ID: {ticketId}</caption>
                </table>
                <div className="overflow-y-auto h-[50vh] max-h-[50vh]"> {/* Wraps only the table */}
                    <table className="min-w-full border-collapse">
                        <thead style={{ position: 'sticky', top: 0 }}>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Article</th>
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Service</th>
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Prix</th>
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Quantité</th>
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Prix Total (DH)</th>
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Couleur</th>
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Marque</th>
                                <th className="px-1 py-2 text-center text-sm font-medium border-b border-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                                        Aucune commande ajoutée pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                orderItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200">{item.article.name}</td>
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200">{item.service.name}</td>
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200">
                                            {item.article.price ? `${item.article.price} DH` : "N/A"}
                                        </td>
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200 truncate overflow-hidden whitespace-nowrap max-w-[80px]">
                                            x{item.quantity}
                                        </td>
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200 truncate overflow-hidden whitespace-nowrap max-w-[80px]">
                                            {item.totalPrice ? `${item.totalPrice.toFixed(2)}` : "N/A"}
                                        </td>
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200">{item.color}</td>
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200 truncate overflow-hidden whitespace-nowrap max-w-[80px]">
                                            {item.brand}
                                        </td>
                                        <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200">
                                            <div className="flex flex-col justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="px-2 py-1 text-sm bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-lg font-semibold text-gray-700">
                        Total: {totalBillPrice.toFixed(2)} DH
                    </div>
                    <button
                        onClick={() => setOrdersConf(true)}
                        disabled={orderItems.length === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}