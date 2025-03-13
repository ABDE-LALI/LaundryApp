import { Categorie } from "./Components/Categorie";
export function Categories() {
    const bikeShopCategories = [
        "Bikes",
        "Bike Parts",
        "Accessories",
        "Clothing & Apparel",
        "Maintenance & Tools",
        "Safety Gear",
        "Electric Bike Accessories",
        "Nutrition & Hydration"
    ];
    return <>
        <div className="categories">
            <h3>Catégories</h3>
            {/* {console.log("bleial")} */}
            <div className="cats">
                {bikeShopCategories.map((cat)=>(<Categorie cat={cat} key={cat} />))}
            </div>
        </div>
    </>
// import { Categorie } from "./Components/Categorie";

// export function Categories() {
//     const bikeShopCategories = [
//         "Bikes",
//         "Bike Parts",
//         "Accessories",
//         "Clothing & Apparel",
//         "Maintenance & Tools",
//         "Safety Gear",
//         "Electric Bike Accessories",
//         "Nutrition & Hydration"
//     ];
    
//     return (
//         <div className="categories">
//             <h3>Catégories</h3>
//             <div className="cats">
//                 {bikeShopCategories.map((cat) => (
//                     <Categorie cat={cat} key={cat} />
//                 ))}
//             </div>
//         </div>
//     );
// }
}