import { Product } from "./Components/product"
export function Products() {
    // const products = [];
    // for(let i = 0; i < 10; i++){
    //     products.push(<Product key = {i}/>)
    // }
    return <div className="list_products">
        <h3>Products</h3>
        <div className="products"> 
        {Array.from({length:10}).map((_, index) => (
         <Product key={index}/>
      ))}
        </div>
    </div>
}