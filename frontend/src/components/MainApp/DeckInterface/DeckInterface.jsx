import { useState, useEffect, useContext } from 'react' ;

// CSS Stylesheet for Deckgl Interface
import styles from './DeckInterface.module.css' ;

import { default as Env3D } from './Env3D/Env3D' ;

function DeckInterface() {

    return(
        <>
        <div className={styles.main}>
            <Env3D />
        </div>
        </>
    ) ;
}

export default DeckInterface ;