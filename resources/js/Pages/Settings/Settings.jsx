import { Head, Link, usePage } from "@inertiajs/react";
import Dashboard from "../Dashboard";
import { useState } from "react";
import EditArticleForm from "@/Components/Editarticleform";
export default function Settings() {
    const { articles, services, ticket_id } = usePage().props;
    const [showmodifyForm, setshowmodifyForm] = useState(false);
    const [modifyArticle, setmodifyArticle] = useState(null);
    console.log(showmodifyForm);
    
    return (
        <Dashboard>
            <Head title="Settings" />
            <Link href={route('settings.addArticle')}>Create Article</Link>
            {/* <Link href={route('settings.editArticle')}>Show Articles</Link> */}
            <div>
                <label className="label">Article</label>
                <div className="article-grid">
                    {articles?.map((article) => (
                        <div key={article.id} className="article-card">
                            <button
                                // key={article.id}
                                // onClick={() => {
                                //     setQuantity('');
                                //     setBrand('');
                                //     setSelectedColor('');
                                //     setShowKeyOrder(true);
                                //     if (keyboardRefQ.current && keyboardRefB.current) {
                                //         keyboardRefQ.current.setInput('');
                                //         keyboardRefB.current.setInput('');
                                //     }
                                // }}
                                // className={``}
                            >
                                <span className="article-name">{article.name}</span>
                                <img src={`/storage/${article.image}`} alt={article.name} className="article-image" />
                            </button>
                            <button className='update-article' onClick={() => {
                                setshowmodifyForm(true);
                                setmodifyArticle(article)
                            }}>Modifier</button>
                            <button className='delete-article' onClick={() => { }}>Supprimer</button>
                        </div>
                    ))}
                </div>
            </div>
                {showmodifyForm && <EditArticleForm article={modifyArticle} setshowmodifyForm = {setshowmodifyForm}/>}
        </Dashboard>
    );
}