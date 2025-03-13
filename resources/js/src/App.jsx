import { LeftSidear } from "./Fragments/LeftSideBar"
import {Content} from "./Fragments/mainContent"
import { RightSideBar } from "./Fragments/RightSideBar"
// import { Loader } from "./Fragments/Loader"
export default function App(){
    return  <>
    {/* <Loader/> */}
    <LeftSidear/>
    <Content/>
    <RightSideBar/>
    </> 
}