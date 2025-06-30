import { Head, router, usePage } from "@inertiajs/react";
import Dashboard from "../Dashboard";
import { useState } from "react";
import EditArticleForm from "@/Components/Editarticleform";
import AddArticleForm from "@/Components/AddArticleForm";
import AddEmployeForm from "@/Components/AddEmployeForm";
import EditArticlesGrid from "./EditArticlesGrid";
import EditEmployeGrid from './EditEmployeGrid';
export default function Settings() {
    const [showArticles, setShowArticles] = useState(true);
    const [showEmploes, setShowEmploes] = useState(false);
    const { articles, user, users } = usePage().props;
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddEmpForm, setShowAddEmpForm] = useState(false);
    const [modifyArticle, setModifyArticle] = useState(null);
    const [modifyUser, setModifyUser] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteArticleId, setDeleteArticleId] = useState(null);
    const [notification, setNotification] = useState(null);
    const [ShowModifyUserForm, setShowModifyUserForm] = useState(null);
    const handleDeleteArticle = (id) => {
        setDeleteArticleId(id);
        setShowConfirm(true);
    };
    const handleDeleteUser = (id) => {
        setDeleteUserId(id);
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
                <div className="justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
                    <div className="flex flex-1 ">
                        <button
                            onClick={() => setShowAddEmpForm(true)}
                            className="px-4 py-2 mr-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                        >
                            Ajouter un Employer
                        </button>

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 mr-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                        >
                            Ajouter un Article
                        </button>
                        <button
                            onClick={() => {setShowEmploes(true); setShowArticles(false)}}
                            className={`px-4 py-2 mr-2 bg-green-500 text-white rounded-lg shadow-md ${showEmploes && "bg-gray-400"}`}
                        >
                            Afficher les Employes
                        </button>

                        <button
                            onClick={() => {setShowArticles(true); setShowEmploes(false)}}
                            className={`px-4 py-2 bg-green-500 text-white rounded-lg shadow-md ${showArticles && "bg-gray-400"}`}
                        >
                            Afficher les Articles
                        </button>


                    </div>
                </div>

                {/* Scrollable articles container */}
                {showArticles && <EditArticlesGrid hahandleDeleteArticle={handleDeleteArticle} articles={articles} setShowModifyForm={setShowModifyForm} setModifyArticle={setModifyArticle} />}
                {showEmploes && <EditEmployeGrid handleDeleteUser={handleDeleteUser} users={users} setShowModifyUserForm={setShowModifyUserForm} setModifyUser={setModifyUser} />}

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