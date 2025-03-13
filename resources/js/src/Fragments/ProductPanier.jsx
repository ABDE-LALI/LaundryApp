export function ProductPanier(){
    return <div className="p-pro">
    {/* <img src="imgs\fatbike.jpg" /> */}
    <div className="desc">
        <span style={{ fontSize: "20px", flex: 1 }}>Fatbike:SnowCruze</span>
        <div className="qte-pric">
            <div className="qte">
                <span className="sign">-</span>
                <span style={{margin: '0px 6px'}}>1</span>
                <span className="sign">+</span>
            </div>
            <span>15000 <span style={{fontSize: "10px",fontWeight: 700}}>DH</span></span>
        </div>
    </div>
</div>
}