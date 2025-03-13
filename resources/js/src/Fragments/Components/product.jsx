import {ProductCommands} from "./ProductCommands"
export function Product() {
    return <div className="product">
        <div className="desc">
            <img src="imgs\YT-Industries-Szepter-Gravel-Bike-3-2000x1334.jpg" />
            <span className="title">TerraTrail <span>A lightweight, durable bike with wide tires and disc
                brakes, designed for smooth rides on roads or rugged trails. Perfect for all-terrain
                adventures.</span><span>5800.00 <span> </span></span><span
                    style={{ fontSize: "10px", fontWeight: 700 }}>DH</span></span>
        </div>
        <ProductCommands/>
    </div>
}