import { useState, useEffect, createContext } from 'react' ;

// App Component Imports
import { NavMenu } from '../NavMenu/NavMenu' ;
import { default as SubHeader } from './DeckInterface/SubHeader/SubHeader' ;
import { default as DeckInterface } from './DeckInterface/DeckInterface' ;
import { default as Sidebar } from './Sidebar/Sidebar' ;

export const SidebarContext = createContext() ;


function MainApp() {

    // Across App Functionality States
    const [sidebarState, setSidebarState] = useState(false) ;
    function toggleSidebar() {
        setSidebarState(!sidebarState) ;
    } ;

    return(
        <>
        <NavMenu showDev={false} />
        < SidebarContext.Provider value={{ sidebarState, setSidebarState }} >
            <SubHeader />
            <Sidebar />
        </ SidebarContext.Provider>

        <DeckInterface />
        </>
    ) ;
}

export default MainApp ;