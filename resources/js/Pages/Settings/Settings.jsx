import { Head, router, usePage } from "@inertiajs/react";
import Dashboard from "../Dashboard";
import { useState } from "react";
import EditArticleForm from "@/Components/Editarticleform";
import AddArticleForm from "@/Components/AddArticleForm";
import AddEmployeForm from "@/Components/AddEmployeForm";
export default function Settings() {
    const { articles, user } = usePage().props;
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddEmpForm, setShowAddEmpForm] = useState(false);
    const [modifyArticle, setModifyArticle] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteArticleId, setDeleteArticleId] = useState(null);
    const [notification, setNotification] = useState(null);

    const handleDeleteArticle = (id) => {
        setDeleteArticleId(id);
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        router.delete(route("settings.deleteArticle", deleteArticleId), {
            onSuccess: () => {
                setNotification({ type: "success", message: "Article supprimé avec succès !" });
                setTimeout(() => setNotification(null), 3000);
            },
            onError: (errors) => {
                console.error(errors);
                setNotification({
                    type: "error",
                    message: "Erreur lors de la suppression de l'article : " + (Object.values(errors).join(', ') || "Erreur inconnue")
                });
                setTimeout(() => setNotification(null), 3000);
            },
            onFinish: () => {
                setShowConfirm(false);
                setDeleteArticleId(null);
            }
        });
    };

    // Styled Confirmation Dialog
    const ConfirmationDialog = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-60">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <p className="text-gray-700 mb-4">Êtes-vous sûr de vouloir supprimer cet article ?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                    >
                        Oui
                    </button>
                    <button
                        onClick={() => {
                            setShowConfirm(false);
                            setDeleteArticleId(null);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                    >
                        Non
                    </button>
                </div>
            </div>
        </div>
    );

    // Styled Notification Component
    const Notification = ({ type, message }) => (
        <div className="fixed top-4 right-4 z-70">
            <div
                className={`p-4 rounded-lg shadow-lg text-white flex items-center gap-2 animate-fade-in ${type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
            >
                <span className="text-lg">{type === "success" ? "✅" : "❌"}</span>
                <p className="font-medium">{message}</p>
            </div>
        </div>
    );

    return (
        <Dashboard>
            <Head title="Settings" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
                    <div>

                        {
                            user.is_admin === 1 && (<button
                                onClick={() => setShowAddEmpForm(true)}
                                className="px-4 py-2 mr-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                            >
                                Ajouter un Employer
                            </button>)}

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                        >
                            Ajouter un Article
                        </button>


                    </div>
                </div>

                {/* Scrollable articles container */}
                <div className="max-h-[87vh] overflow-y-auto">
                    <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-6">
                        {articles?.map((article) => (
                            <div key={article.id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`/storage/${article.image}`}
                                        alt={article.name}
                                        className="object-cover rounded-md mb-3"
                                    />
                                    <span className="text-lg font-semibold text-gray-700">{article.name}</span>
                                </div>

                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => {
                                            setShowModifyForm(true);
                                            setModifyArticle(article);
                                        }}
                                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                    >
                                        Modify
                                    </button>
                                    <button
                                        onClick={() => handleDeleteArticle(article.id)}
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Forms for Editing and Adding Articles */}
                {showModifyForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <EditArticleForm article={modifyArticle} setshowmodifyForm={setShowModifyForm} />
                    </div>
                )}

                {showAddForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <AddArticleForm setshowaddForm={setShowAddForm} />
                    </div>
                )}
                {showAddEmpForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <AddEmployeForm setshowaddForm={setShowAddEmpForm} />
                    </div>
                )}

                {/* Confirmation Dialog and Notification */}
                {showConfirm && <ConfirmationDialog />}
                {notification && <Notification type={notification.type} message={notification.message} />}
            </div>
        </Dashboard>
    );
}