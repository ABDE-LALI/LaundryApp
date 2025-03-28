import { Head, router, usePage } from "@inertiajs/react";
import Dashboard from "../Dashboard";
import { useState } from "react";
import EditArticleForm from "@/Components/Editarticleform";
import AddArticleForm from "@/Components/AddArticleForm";

export default function Settings() {
    const { articles } = usePage().props;
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [modifyArticle, setModifyArticle] = useState(null);

    const deleteArticle = (id) => {
        if (confirm("Are you sure you want to delete this article?")) {
            router.delete(route("settings.deleteArticle", id));
        }
    };

    return (
        <Dashboard>
            <Head title="Settings" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Articles Management</h2>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                    >
                        Add Article
                    </button>
                </div>

                <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-6">
                    {articles?.map((article) => (
                        <div key={article.id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
                            <div className="flex flex-col items-center">
                                <img
                                    src={`/storage/${article.image}`}
                                    alt={article.name}
                                    className=" object-cover rounded-md mb-3"
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
                                    onClick={() => deleteArticle(article.id)}
                                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Forms for Editing and Adding Articles */}
                {/* Forms for Editing and Adding Articles */}
                {showModifyForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <EditArticleForm article={modifyArticle} setShowModifyForm={setShowModifyForm} />
                    </div>
                )}

                {showAddForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <AddArticleForm setShowAddForm={setShowAddForm} />
                    </div>
                )}

            </div>
        </Dashboard>
    );
}
