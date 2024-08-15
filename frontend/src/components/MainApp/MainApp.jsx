import { useState, useEffect, createContext } from 'react' ;

// App Component Imports
import { NavMenu } from '../NavMenu/NavMenu' ;
import { default as SubHeader } from './SubHeader/SubHeader' ;
import { default as DeckInterface } from './DeckInterface/DeckInterface' ;
import { default as Sidebar } from './Sidebar/Sidebar' ;


// Create Context --> Transmit information across components from parent to children //
export const SidebarContext = createContext() ;  // Sidebar Context
export const ClimateDataContext = createContext() ; // Climate Data Selections
export const RTMAContext = createContext() ; // RTMA Data


function MainApp() {

    // Across App Functionality States
    const [sidebarState, setSidebarState] = useState(false) ;
    function toggleSidebar() {
        setSidebarState(!sidebarState) ;
    } ;

    // Turn Selected Climate Datasets ON / OFF
    const [climateDataOn, setClimateDataOn] = useState({}) ;


    // ****************************************************************************** //
    //                         **** RTMA DATA ****                                    //
    // ****************************************************************************** //
    const [rtmaForm, setRtmaForm] = useState(null) ;
    const [rtmaData, setRtmaData] = useState(null) ;


    return(
        <>
        <NavMenu showDev={false} />
        < SidebarContext.Provider value={{ sidebarState, setSidebarState }} >
        < ClimateDataContext.Provider value={{ climateDataOn, setClimateDataOn }} >
        < RTMAContext.Provider value ={{ rtmaForm, setRtmaForm, rtmaData, setRtmaData }} >

            <SubHeader />
            <Sidebar />
            <DeckInterface />
        
        </ RTMAContext.Provider >
        </ ClimateDataContext.Provider >
        </ SidebarContext.Provider >
        </>
    ) ;
}

export default MainApp ;