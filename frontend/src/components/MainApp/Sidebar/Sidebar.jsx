// --------------------------------------------------------------------------------------- //
//  Navigation Menu Sidebar for MainApp Component                                          //
// ~ Popup Sidebar for Changing, Adding, Hiding, and Confguring Data / Settings ~          //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// Import React Hooks
import { useState, useEffect, useContext } from 'react' ;

// CSS Stylesheet for Sidebar Menu
import styles from './Sidebar.module.css' ;

// React-Icons
import { IoSettingsOutline } from "react-icons/io5";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { IoEarthSharp } from "react-icons/io5";
import { MdLocationCity } from "react-icons/md";

import Nav from "react-bootstrap/Nav" ;

// Sidebar Menu Components
import { default as ClimateData } from './Tabs/ClimateData/ClimateData' ;
import CoolingCenters from './Tabs/InfrastructureData/CoolingCenters/CoolingCenters';
import Settings from './Tabs/Settings/Settings'

// React Context Across Components
import { SidebarContext } from '../MainApp';
   

// Sidebar Menu Component
function Sidebar() {
    // Load Context into Component //
    const sidebarContext = useContext(SidebarContext) ;

    // ARRAY OF SIDEBAR MENU ITEMS //
    const menuItemsNew = [
        {value: 0, name: "Climate Data", 
            icon: <IoEarthSharp className={styles.menuIcon} />, 
            content: <ClimateData />},
        {value: 1, name: "Socioeconomic Data", 
            icon: <MdOutlineLibraryAdd className={styles.menuIcon} />, 
            content: 'Hello'},
        {value: 2, name: "Infrastructure Data", 
            icon: <MdLocationCity className={styles.menuIcon} />, 
            content: <CoolingCenters />},
        {value: 3, name: "Adjust Settings", 
            icon: <IoSettingsOutline className={styles.menuIcon} />, 
            content: <Settings />},
    ] ;

    // Captures & Sets the Active Tab's State //
    const [activeTab, setActiveTab] = useState(menuItemsNew[0]) ;
    const [openTab, setOpenTab] = useState(false) ;
    const handleTab = (tab) => {
        setActiveTab(tab) ;
        if (tab.value === activeTab.value && openTab){
            setOpenTab(false) ;
        } else {
            setOpenTab(true) ;
        }
    } ;

    return(
        <>
        <header className={sidebarContext.sidebarState ? [styles.sidebarNew, styles.active].join(" ") : styles.sidebarNew}>
            <nav>
                <ul>
                    <li style={{borderBottom: "none", 
                        backgroundColor: 'rgba(255, 255, 255, 1.0)', cursor: "default", marginTop: "-0.7rem",
                        marginLeft: '-0.3rem',
                        marginBottom: "-0.85rem", letterSpacing: "0.05rem", }}>
                        <h2 style={{fontSize: "1.75rem", fontWeight: "650"}}>
                            Customization Panel
                        </h2>
                    </li>
                    {/* Iterate through Sidebar Menu Items and Render as Verical Menu */}
                    {menuItemsNew.map((element) => {
                        return(
                            <li style={{backgroundColor: activeTab.value === element.value ? 'rgba(0, 0, 190, 0.055)' : 'rgba(255, 255, 255, 1.0)'}}>
                                <Nav.Item key={element.value}
                                    onClick={() => handleTab(element)}>
                                        <Nav.Link eventKey={element.value} style={{textDecoration: 'none'}}>
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                <div>
                                                    {element.icon}
                                                </div>
                                                <div className={styles.sidebarLabel}>
                                                    {element.name}
                                                </div>
                                            </div>
                                        </Nav.Link>
                                </Nav.Item>
                            </li>
                        )
                    })
                }
                </ul>
            </nav>
        </header>

        <div className={(sidebarContext.sidebarState && openTab) ? [styles.tabMenu, styles.tabActive].join(" ") : styles.tabMenu}>
            {activeTab.content}
        </div>
        </>
    ) ;
}

export default Sidebar ;
