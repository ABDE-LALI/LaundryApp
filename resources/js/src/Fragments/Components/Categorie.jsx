export function Categorie({cat}) {
    return <span className={cat==="Bikes" ? "cat active":"cat"}>{cat}</span>
} 