import React, { useEffect, useState } from 'react';
import VirtualKeyboard from './VirtualKeyboard';

export default function Ordersvalidation({
    totalBillPrice,
    billstatus,
    setBillPaymentStatus,
    paidAmount,
    setPaidAmount,
    valider,
    setOrdersConf,
    setActiveInputConfirm,
    handlePaidAmountFocus,
    onKeyboardChangeConfirm,
    keyboardRefConfirm,
    keyboardLayoutConfirm,
    activeInputConfirm,
    confirmKeyboardContainerRef,
    orderItems,
}) {
    // const [billrest] = useState(totalBillPrice);

    useEffect(() => {
        setPaidAmount(0);
    }, [billstatus, setPaidAmount]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-[90vw] h-[80vh] h-max-[90vh] w-full transform transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Section - Payment Details */}
                    <div className="w-1/4 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer le Paiement</h3>

                        {/* Bill Status Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Statut de Paiement
                            </label>
                            <select
                                value={billstatus}
                                onChange={(e) => setBillPaymentStatus(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                <option value="unpaid">Non Payé</option>
                                <option value="paid">Payé</option>
                                <option value="paid_some">Payé Partiellement</option>
                            </select>
                        </div>

                        {/* Conditional Paid Amount Input */}
                        {billstatus === 'paid_some' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Montant Payé
                                </label>
                                <input
                                    type="text"
                                    value={paidAmount}
                                    onFocus={handlePaidAmountFocus}
                                    readOnly
                                    placeholder="Saisir le montant"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        {/* Virtual Keyboard (Only for partial payments) */}
                        {billstatus === 'paid_some' && (
                            <div ref={confirmKeyboardContainerRef} className="mt-4">
                                <VirtualKeyboard
                                    keyboardRef={keyboardRefConfirm}
                                    onChangeAll={onKeyboardChangeConfirm}
                                    initialLayout={keyboardLayoutConfirm}
                                    inputName={activeInputConfirm}
                                />
                            </div>
                        )}
                    </div>


                    {/* Middle Section - Order Summary Table */}
                    <div className="w-full md:w-2/4 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé des Commandes</h3>
                        <div className="overflow-y-auto max-h-[65vh]"> {/* Added wrapper div with scroll styles */}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
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
                                                    {item.totalPrice ? `${item.totalPrice.toFixed(2)} DH` : "N/A"}
                                                </td>
                                                <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200">{item.color}</td>
                                                <td className="px-1 py-2 text-sm text-gray-600 border-b border-gray-200 truncate overflow-hidden whitespace-nowrap max-w-[80px]">
                                                    {item.brand}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {/* Right Section - Payment Summary */}
                    <div className="w-1/4 space-y-6">
                        {/* Total Price Display */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-semibold text-blue-800 ">Total à Payer en (DH)</p>
                            <p className="text-2xl font-bold text-blue-900 truncate overflow-hidden whitespace-nowrap max-w-[100px]">
                                {totalBillPrice.toFixed(2)} 
                            </p>
                        </div>

                        {/* Amount Remaining/Change Display */}
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700">
                                {paidAmount > totalBillPrice ? 'Monnaie à Rendre en (DH)' : 'Reste à Payer en (DH)'}
                            </p>
                            <p className="text-xl font-bold text-gray-900 truncate overflow-hidden whitespace-nowrap max-w-[100px]">
                                {paidAmount > totalBillPrice
                                    ? `${Math.abs(totalBillPrice - paidAmount).toFixed(2)} DH`
                                    : `${Math.max(totalBillPrice - paidAmount, 0).toFixed(2)} DH`}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={valider}
                                className="w-full py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                            >
                                Valider La Commande
                            </button>
                            <button
                                onClick={() => {
                                    setOrdersConf(false);
                                    setPaidAmount('');
                                    setBillPaymentStatus('unpaid');
                                    setActiveInputConfirm(null);
                                }}
                                className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}