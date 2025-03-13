import { RightSideBar } from "@/src/Fragments/RightSideBar";
import Dashboard from "../Dashboard";
import VirtualKeyboard from "@/src/Fragments/Components/VirtualKeyboard";
import React, { useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export default function Create() {
    const { articles } = usePage().props;
    const [selectedArticle, setSelectedArticle] = useState('');
    const [quantity, setQuantity] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const [keyboardInput, setKeyboardInput] = useState('quantity');
    const [layout, setLayout] = useState('numeric');
    const keyboardRef = useRef(null); // Add ref to control keyboard

    const keyboardLayout = {
        numeric: [
            '1 2 3',
            '4 5 6',
            '7 8 9',
            '. 0 {bksp}'
        ],
        alphanumeric: [
            '1 2 3 4 5 6 7 8 9 0',
            'q w e r t y u i o p',
            'a s d f g h j k l',
            '{shift} z x c v b n m {bksp}',
            '{space} {enter}'
        ],
        alphanumericShift: [
            '! @ # $ % ^ & * ( )',
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            '{shift} Z X C V B N M {bksp}',
            '{space} {enter}'
        ]
    };

    const onKeyboardChange = (input) => {
        if (keyboardInput === 'quantity') {
            setQuantity(input);
        }
    };

    const onKeyPress = (button) => {
        if (button === '{shift}' || button === '{lock}') {
            setLayout(layout === 'alphanumeric' ? 'alphanumericShift' : 'alphanumeric');
        }
        if (button === '{enter}') {
            handleAddToOrder();
        }
    };

    const handleAddToOrder = () => {
        if (selectedArticle && quantity) {
            const selectedArticleObj = articles.find(a => a.id === parseInt(selectedArticle));
            if (!selectedArticleObj) return;

            const item = {
                article: selectedArticleObj,
                quantity: parseFloat(quantity),
            };

            setOrderItems(prevItems => [...prevItems, item]);
            // Reset everything
            setSelectedArticle('');
            setQuantity('');
            setKeyboardInput('quantity');
            if (keyboardRef.current) {
                keyboardRef.current.setInput(''); // Reset keyboard input
            }
        }
    };

    const handleQuantityFocus = () => {
        setKeyboardInput('quantity');
        setQuantity(''); // Clear quantity when focusing
        if (keyboardRef.current) {
            keyboardRef.current.setInput(''); // Reset keyboard input
        }
    };

    return (
        <Dashboard>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Prendre Commandes</h2>
                <div className="space-y-4">
                    {/* Article Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Article</label>
                        <select
                            value={selectedArticle}
                            onChange={(e) => {
                                setSelectedArticle(e.target.value);
                                setQuantity(''); // Reset quantity when changing article
                                if (keyboardRef.current) {
                                    keyboardRef.current.setInput('');
                                }
                            }}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Sélectionner un article</option>
                            {articles?.map((article) => (
                                <option key={article.id} value={article.id}>
                                    {article.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantité</label>
                        <input
                            value={quantity}
                            readOnly
                            onFocus={handleQuantityFocus}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter quantity"
                        />
                    </div>

                    {/* Virtual Keyboard */}
                    <div className="flex justify-center">
                        <Keyboard
                            keyboardRef={r => (keyboardRef.current = r)}
                            layoutName={layout}
                            layout={keyboardLayout}
                            onChange={onKeyboardChange}
                            onKeyPress={onKeyPress}
                            inputName={keyboardInput}
                            display={{
                                '{bksp}': '⌫',
                                // '{enter}': '↵',
                                // '{shift}': '⇧',
                                // '{space}': ' '
                            }}
                        />
                        {/* Order Summary */}
                        {orderItems.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Commandes en cours</h3>
                                <ul className="list-disc pl-5 mt-2">
                                    {orderItems.map((item, index) => (
                                        <li key={index} className="py-1">
                                            {item.article.name} - x{item.quantity}
                                            {item.article.price && ` - ${item.quantity * item.article.price} DH`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Add to Order Button */}
                    <button
                        onClick={handleAddToOrder}
                        disabled={!selectedArticle || !quantity}
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Ajouter à la commande
                    </button>
                </div>
            </div>
        </Dashboard>
    );
}