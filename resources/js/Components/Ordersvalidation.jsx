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
}) {
    const [billrest] = useState(totalBillPrice);

    useEffect(() => {
        setPaidAmount(0);
    }, [billstatus, setPaidAmount]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-[90vw] h-[80vh] h-max-[90vh] w-full md:max-w-2xl transform transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Section - Payment Details */}
                    <div className="w-full md:w-1/2 space-y-4">
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

                    {/* Right Section - Payment Summary */}
                    <div className="w-full md:w-1/2 space-y-6">
                        {/* Total Price Display */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm font-semibold text-blue-800">Total à Payer</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {totalBillPrice.toFixed(2)} DH
                            </p>
                        </div>

                        {/* Amount Remaining/Change Display */}
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700">
                                {paidAmount > totalBillPrice ? 'Monnaie à Rendre' : 'Reste à Payer'}
                            </p>
                            <p className="text-xl font-bold text-gray-900">
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
                                Confirmer le Paiement
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