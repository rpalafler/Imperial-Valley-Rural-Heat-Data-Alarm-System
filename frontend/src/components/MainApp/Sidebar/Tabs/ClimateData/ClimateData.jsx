// --------------------------------------------------------------------------------------- //
//  Climate Data Menu Selection Component                                                  //
// ~ Options for Selecting and Customizing Climate Datasets ~                              //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// Import React Hooks
import { useState, useEffect, useContext } from 'react' ;

// React-Bootstrap Components
import Nav from "react-bootstrap/Nav" ;

// CSS Modules
import styles from './ClimateData.module.css' ;

// Import components
import { default as RTMA } from './RTMA/RTMA' ;

// Import Context
import { ClimateDataContext, RTMAContext } from '../../../MainApp';



function ClimateData() {
    const climateDataContext = useContext(ClimateDataContext) ;
    const rtmaContext = useContext(RTMAContext) ;

    const [checkedItems, setCheckedItems] = useState(climateDataContext.climateDataOn) ;
    const handleDataSelection = (event) => {
        const { id, checked } = event.target ;
        setCheckedItems({
            ...checkedItems,
            [id]: checked,
        }) ;
        climateDataContext.setClimateDataOn({
            ...checkedItems,
            [id]: checked,
        })
        console.log({
            ...checkedItems,
            [id]: checked,
        }) ;
    } ;


    // Satellite (Remote-Sensing) Datasets Array //
    const satelliteMenu = [
        {
            name: 'Hourly Real-Time Mesoscale Analysis (RTMA) Data',
            id: 'rtma',
            component: <RTMA />,
            tabOpen: climateDataContext.climateDataTabOn,
        },
    ] ;
    // Station (Fixed and Movable) Datasets Array //
    const stationMenu = [
        {
            name: 'CDO Sensors (Dew Point and Relative Humidity)',
            id: 'cdo',
            component: <RTMA />,
            tabOpen: climateDataContext.climateDataTabOn,
        },
        {
            name: 'Global Historical Climatology Network (GHCN) Data',
            id: 'ghcn',
            component: 'ghcn',
        },
    ] ;
    

    // Dataset Querying (Customization) Tab //
    const [dataTabOpen, setDataTabOpen] = useState(false) ;
    const [dataOption, setDataOption] = useState(satelliteMenu[0]) ;
    const [climateTabOpen, setClimateTabOpen] = useState(climateDataContext.climateDataTabOn) ;

    useEffect(() => {
        setClimateTabOpen(climateDataContext.climateDataTabOn) ;
    }, [climateDataContext.climateDataTabOn]) ;

    const handleDataOption = (option) => {
        console.log('Hello', option) ;
        setDataOption(option) ;
        climateDataContext.setClimateDataTabOn(true) ;
    } ;


    return(
        <>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            { (climateTabOpen !== true) ?
                <>
                <div className={styles.sectionContent}>
                    <h4>
                        Remote Sensing Data
                    </h4>
                    <ul>
                        {satelliteMenu.map((element) => {
                            return(
                                    <li onClick={() => handleDataOption(element)}>
                                        <input type="checkbox" 
                                            id={element.id}
                                            name={element.id}
                                            checked={checkedItems[element.id] || false }
                                            onChange={handleDataSelection} />
                                                <Nav.Item key={element.value}>
                                                        <Nav.Link eventKey={element.value} style={{textDecoration: 'none', color: 'rgba(0, 0, 0, 1)'}}>
                                                            <label htmlFor={element.id}>
                                                                <div className={styles.checkBox}>
                                                                    {element.icon} {element.name}
                                                                </div>
                                                            </label>
                                                        </Nav.Link>
                                                </Nav.Item>
                                    </li>
                            )
                        })}
                    </ul>
                </div>

                <div className={styles.sectionContent}>
                    <h4>
                        Monitoring Station Data
                    </h4>
                    <ul>
                        {stationMenu.map((element) => {
                            return(
                                    <li onClick={() => handleDataOption(element)}>
                                        <input type="checkbox" 
                                            id={element.id}
                                            name={element.id}
                                            checked={checkedItems[element.id] || false }
                                            onChange={handleDataSelection} />
                                                <Nav.Item key={element.value}>
                                                        <Nav.Link eventKey={element.value} style={{textDecoration: 'none', color: 'rgba(0, 0, 0, 1)'}}>
                                                            <label htmlFor={element.id}>
                                                                <div className={styles.checkBox}>
                                                                    {element.icon} {element.name}
                                                                </div>
                                                            </label>
                                                        </Nav.Link>
                                                </Nav.Item>
                                    </li>
                            )
                        })}
                    </ul>
                </div>
                </>
            :
            <div className={styles.sectionContent}>
                <h4>
                    {dataOption.name}
                </h4>
                <div className={styles.bodyContent}>
                    {dataOption.component}
                </div>
            </div>
            }
        </div>
        </>
    ) ;
}

export default ClimateData ;