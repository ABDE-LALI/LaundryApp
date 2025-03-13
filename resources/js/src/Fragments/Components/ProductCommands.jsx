export function ProductCommands() {
    return <>
        <div className="options">
            <span className="title">Taille</span>
            <div className="opts">
                <span className="opt ">S</span>
                <span className="opt active">M</span>
                <span className="opt">L</span>
                <span className="opt">XL</span>
            </div>
        </div>
        <div className="options">
            <span className="title">Colors</span>
            <div className="opts">
                <span className="opt"><span className="color"
                    style={{backgroundColor: "black"}}></span>Black</span>
                <span className="opt active"><span className="color"
                    style={{backgroundColor: "white"}}></span>White</span>
                <span className="opt"><span className="color" style={{backgroundColor: "red"}}></span>Red</span>
                <span className="opt"><span className="color" style={{backgroundColor: "blue"}}></span>Blue</span>
            </div>
        </div>
        <hr style={{border: 0,borderTop: "1px solid rgb(0, 0, 0, .2)"}}/>
            <input type="button" value="Ajouter au panier" className="add"></input>
        </>
}