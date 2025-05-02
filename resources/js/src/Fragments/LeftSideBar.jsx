import { Link, router } from "@inertiajs/react";
import { Section } from "./Components/section";
import { useState } from "react";

export function LeftSideBar() {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Handle logout confirmation
    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onSuccess: () => {
                router.visit("/");
            },
            onError: (errors) => {
                console.error("Logout error:", errors);
                alert("Erreur lors de la déconnexion.");
            },
        });
    };

    // Prevent default Link behavior and show confirmation dialog
    const handleLogoutClick = (e) => {
        e.preventDefault();
        setShowLogoutConfirm(true);
    };

    // Styled Confirmation Dialog Component matching the provided style
    const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <p className="text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        aria-label="Confirm logout"
                    >
                        Oui
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        aria-label="Cancel logout"
                    >
                        Non
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="Left_Sidebar bg-gray-500 border-r-[1px]" style={{ width: '200px', height: '100vh' }}>
            <div className="menu bg-transparent">
                <Section />
            </div>
            <Link href={route('logout')} onClick={handleLogoutClick}>
                <div
                    // className="sec"
                    className="flex items-center gap-3 p-2 m-2 rounded-lg text-gray-200 hover:bg-red-50 hover:text-red-600 
                              focus:outline-none focus:ring-2 focus:ring-red-300 focus:bg-red-50
                              active:bg-red-100 active:scale-[0.98] transition-all duration-200"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: '55px',
                    }}
                >
                    <svg
                        style={{ height: '24px', width: '24px' }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                        />
                    </svg>
                    <span>Déconnexion</span>
                </div>
            </Link>

            {/* Logout Confirmation Dialog */}
            {showLogoutConfirm && (
                <ConfirmationDialog
                    message="Êtes-vous sûr de vouloir vous déconnecter ?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutConfirm(false)}
                />
            )}
        </div>
    );
}