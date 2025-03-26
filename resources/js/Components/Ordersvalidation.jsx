import React, { useEffect, useState } from 'react';
import VirtualKeyboard from './VirtualKeyboard';

// Ordersvalidation component for confirming an order
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
    confirmKeyboardContainerRef,
    setrest // Ref to the container for click-outside detection
}) {
    const [billrest, setBillRest] = useState(totalBillPrice);
    useEffect(() => {setPaidAmount(0)}, [billstatus]);
    return (
        // Modal container with 'orders-confirmation' class for styling
        <div className="orders-confirmation">
            {/* Modal content with 'modal-content' class for styling */}
            <div className="modal-content">
                {/* Display the total price of the order */}
                <strong>Total Price: {totalBillPrice.toFixed(2)} DH</strong>
                <br />

                {/* Bill status selection */}
                <label>Bill Status: </label>
                <select
                    value={billstatus}
                    onChange={(e) => setBillStatus(e.target.value)}
                >
                    <option value="unpaid">Non Payé</option>
                    <option value="paid">Payé</option>
                    <option value="paid_some">Paye quelque</option>
                </select>
                <br />

                {/* Paid amount input (shown only if bill status is 'paid_some') */}
                {billstatus === 'paid_some' && (
                    <>
                        <label>Paid Amount: </label>
                        <input
                            type="text"
                            value={paidAmount}
                            onFocus={handlePaidAmountFocus} // Activates virtual keyboard
                            readOnly // Prevents direct typing (uses virtual keyboard)
                            name="paid_amount"
                            id="paid_amount"
                            placeholder="Enter paid amount"
                        />
                    </>
                )}
                <br />

                {/* Virtual keyboard for entering the paid amount */}
                <div
                    className="virtual-keyboard-container"
                    ref={confirmKeyboardContainerRef} // For click-outside detection
                >
                    <VirtualKeyboard
                        keyboardRef={keyboardRefConfirm}
                        onChangeAll={onKeyboardChangeConfirm} // Handles keyboard input
                        initialLayout={keyboardLayoutConfirm} // Sets keyboard layout
                        inputName={activeInputConfirm} // Tracks active input
                    />
                </div>

                {/* Display remaining amount or change to be returned */}
                <strong>
                    {paidAmount > totalBillPrice
                        ? `back: ${(totalBillPrice - paidAmount)*-1} DH` // Change to be returned
                        : billstatus !== 'paid'
                        ? `Rest: ${billrest.toFixed(2) - paidAmount} DH` // Remaining amount to be paid
                        : 'Rest: 0 DH'} {/* Fully paid, no remaining amount */}
                </strong>
                <br />

                {/* Validate button to submit the order */}
                <button
                    className="bg-green-400 p-1 mt-2"
                    onClick={valider}
                >
                    Valider
                </button>

                {/* Cancel button to close the modal */}
                <button
                    className="bg-red-400 p-1 mt-2 ml-2"
                    onClick={() => {
                        setOrdersConf(false); // Close the modal
                        setPaidAmount(''); // Reset paid amount
                        setBillStatus('unpaid'); // Reset bill status to default
                        setActiveInputConfirm(null); // Reset active input
                    }}
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}