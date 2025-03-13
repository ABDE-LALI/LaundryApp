import { useState, useEffect } from 'react';
import { Dot } from './Components/LoadDot';
import logo from '../../imgs/669350e8b960b45a20614fcfc216b003.png';
import v1 from '../../imgs/v1.png';
import v2 from '../../imgs/v2.png';

export function Loader() {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        if (dots < 6) {
            const timer = setTimeout(() => {
                setDots(dots + 1);
            }, 500);
            return () => clearTimeout(timer); // Clean up the timeout on unmount
        }
    }, [dots]);

    return (
        <>
            <div className="loader">
                <div className='circle'>
                    {/* <img src={logo} alt="" /> */}
                    <img src={v2} alt="" />
                    <img className='v1' src={v1} alt="" />
                </div>
                {/* <div className='dots'>
                    {Array.from({ length: dots }).map((_, index) => (
                        <Dot key={index} />
                    ))}
                </div> */}
            </div>
        </>
    );
}
