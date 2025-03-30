import { LeftSideBar } from "@/src/Fragments/LeftSideBar";
import './../../../CSS/main_style.min.css'
export default function Dashboard({ children }) {
    return (
        <div className="dashboard">
            {/* <Loader/> */}
            <LeftSideBar />
            {children}

        </div>
    );
}
