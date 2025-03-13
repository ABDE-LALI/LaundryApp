import { ProductPanier } from "./ProductPanier"
export function RightSideBar() {
    let tot_befor = 1077.00
    let tot_after = 977.00
    return <div className="right_sidebar">
        <div className="panier">
            <h3>Panier</h3>
            {Array.from({ length: 4 }).map((_, index) => (<ProductPanier key={index} />))}
            <div className="total">
                <span style={{ fontSize: 20, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 700, opacity: .4 }}>
                    <span style={{ textDecoration: "line-through" }}>{tot_befor}</span><span style={{ fontSize: 10 }}>DH</span></span>
                <span style={{ fontSize: 20, fontWeight: 700 }}>{tot_after}<span style={{ fontSize: 10, fontWeight: 700 }}>DH</span></span>
            </div>
            <div className="field">
                <span className="title">Espece</span>
                <span className="amount">1000.00</span>
                <span className="cashTax">23.00</span>
            </div>
            <div className="field">
                <span className="title">Descount</span>
                <span className="amount">100.00</span>
            </div>
            <div className="paymentmeth">
                <div className="meth activ">
                    {/* <img className="payPic" src={cash} /> */}
                    <div className="paytitle">Cash</div>
                </div>
                <div className="meth">
                    {/* <img className="payPic" src={cart} /> */}
                    <div className="paytitle">Card</div>
                </div>
                <div className="meth valid">Valid</div>
            </div>
        </div>
    </div>
}