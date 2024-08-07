import react, { useState, useEffect, useContext } from "react" ;

// React-Icons
import { IoLogoGameControllerB } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { IoIosArrowForward } from "react-icons/io";
// Dropdown Menu Button
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import styles from "./SubHeader.module.css" ;
import { Container, Row, Col, Image, ResponsiveEmbed } from "react-bootstrap" ;

// React Context Across Components
import { SidebarContext } from "../../MainApp";

function GlobeSubMenu() {

    // Load Context into Component //
    const sidebarContext = useContext(SidebarContext) ;

    // Toggle Sidebar ON/OFF //
    const [sidebarOn, setSidebarOn] = useState(sidebarContext.sidebarState) ;
    const toggleSidebar = (event) => {
        setSidebarOn(event)
        sidebarContext.setSidebarState(event) ;
        console.log(event) ;
    }

    return (
        <>
        <Container fluid className={styles.subMenu}>
            <Row style={{width: "100%"}}>

                <Col style={{display: "flex", flexDirection: "row",}}>
                    <div className={styles.subMenuIcon}
                        onClick={() => toggleSidebar(!sidebarOn)}
                        className={styles.hamburgerMenu}
                        style={{color: sidebarOn === true ? 'rgba(150, 150, 150, 0.95)' : 'rgba(233, 233, 233, 1)'}}>
                        <TiThMenu  />
                    </div>

                    <IoLogoGameControllerB className={styles.subMenuLabelIcon} />
                    <div className={styles.subMenuLabel}>
                        3D-View
                    </div>
                </Col>

            </Row>
        </Container>
        </>
    ) ;
}

export default GlobeSubMenu ;