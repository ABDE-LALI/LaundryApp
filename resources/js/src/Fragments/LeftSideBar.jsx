import { Section } from "./Components/section";
export function LeftSideBar() {
    return (
        <div className="Left_Sidebar">
            {/* <img className="logo" src="imgs/669350e8b960b45a20614fcfc216b003.png" alt="not found" /> */}
            <div className="menu">
                <Section/>
            </div>
            <div className="sec" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '55px' }}>
                <svg style={{ height: '24px', width: '24px' }} xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                <span>Déconnexion</span>
            </div>
        </div>
    );
}
