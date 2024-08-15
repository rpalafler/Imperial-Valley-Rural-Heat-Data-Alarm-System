import { useState } from 'react';
import styles from './DeckInterface.module.css';

import Env3D from './Env3D/Env3D';
import MapComponent from './Env2D/map.js';

function DeckInterface() {
    const [show3D, setShow3D] = useState(true);

    const toggleView = () => {
        setShow3D(prevShow3D => !prevShow3D);
    };

    return (
        <>
            <button onClick={toggleView}>
                {show3D ? 'Switch to 2D View' : 'Switch to 3D View'}
            </button>
            <div className={styles.main}>
                {show3D ? <Env3D /> : <MapComponent />}
            </div>
        </>
    );
}

export default DeckInterface;