import React, { useEffect, useState } from 'react';
import VirtualKeyboard from './VirtualKeyboard';

export default function Ordersvalidation({
    totalBillPrice, // Total price of the order (number)
    billstatus, // Current bill status: 'unpaid', 'paid', or 'paid_some' (string)
    setBillStatus, // Function to update bill status
    paidAmount, // Amount paid by the customer (string)
    setPaidAmount, // Function to update paid amount
    valider, // Function to submit the order
    setOrdersConf, // Function to toggle modal visibility
    setActiveInputConfirm, // Function to reset active input for virtual keyboard
    handlePaidAmountFocus, // Function to handle focus on paid amount input
    onKeyboardChangeConfirm, // Function to handle virtual keyboard input
    keyboardRefConfirm, // Ref to the virtual keyboard instance
    keyboardLayoutConfirm, // Keyboard layout: 'numeric' or 'alphanumeric' (string)
    activeInputConfirm, // Active input field for the virtual keyboard (string|null)
    confirmKeyboardContainerRef, // Ref to the container for click-outside detection
}) {
    const [billrest, setBillRest] = useState(totalBillPrice);

    useEffect(() => {
        setPaidAmount(0); // Reset paid amount when bill status changes
    }, [billstatus]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmer la Commande</h3>

                <div className="space-y-4">
                    {/* Total Price */}
                    <div>
                        <strong className="text-gray-700">Prix Total: {totalBillPrice.toFixed(2)} DH</strong>
                    </div>

                    {/* Bill Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut de la Facture:</label>
                        <select
                            value={billstatus}
                            onChange={(e) => setBillStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="unpaid">Non Payé</option>
                            <option value="paid">Payé</option>
                            <option value="paid_some">Payé Partiellement</option>
                        </select>
                    </div>

                    {/* Paid Amount Input */}
                    {billstatus === 'paid_some' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé:</label>
                            <input
                                type="text"
                                value={paidAmount}
                                onFocus={handlePaidAmountFocus}
                                readOnly
                                name="paid_amount"
                                id="paid_amount"
                                placeholder="Entrez le montant payé"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Virtual Keyboard */}
                    {billstatus === 'paid_some' && (
                        <div ref={confirmKeyboardContainerRef}>
                            <VirtualKeyboard
                                keyboardRef={keyboardRefConfirm}
                                onChangeAll={onKeyboardChangeConfirm}
                                initialLayout={keyboardLayoutConfirm}
                                inputName={activeInputConfirm}
                            />
                        </div>
                    )}

                    {/* Remaining Amount or Change */}
                    <div>
                        <strong className="text-gray-700">
                            {paidAmount > totalBillPrice
                                ? `À Rendre: ${((totalBillPrice - paidAmount) * -1).toFixed(2)} DH`
                                : billstatus !== 'paid'
                                ? `Reste: ${(billrest - paidAmount).toFixed(2)} DH`
                                : 'Reste: 0 DH'}
                        </strong>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={valider}
                            className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors"
                        >
                            Valider
                        </button>
                        <button
                            onClick={() => {
                                setOrdersConf(false);
                                setPaidAmount('');
                                setBillStatus('unpaid');
                                setActiveInputConfirm(null);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}