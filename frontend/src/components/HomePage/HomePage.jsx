// --------------------------------------------------------------------------------------- //
//  Homepage (Front Page) Component                                                        //
// ~ Contains Navigation Menu, Information about Project, and Links to other Pages ~       //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// React Hook Imports
import { useState, useEffect } from "react" ;

// React-Router Navigation Links
import { NavLink } from "react-router-dom" ;

import styles from "./HomePage.module.css" ;
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Navigation Menu Component
import {NavMenu} from "../NavMenu/NavMenu" ;

// React Icons for Content Sections
import { IoCloudDoneOutline } from "react-icons/io5";
import { BsKey } from "react-icons/bs";
import { PiWall } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";

// React-Bootstrap Responsive Layout Components
import { Form, Button, Container, Row, Col, Image, ResponsiveEmbed } from "react-bootstrap" ;

const Hero = () => {
    return(
        <div className={styles.hero}>
            <div className={styles.hero_image}>
            </div>
            <div className={styles.hero_welcome}>
                <img src={"imperial-valley-square-logo.png"} className={styles.logo_image}/>
            </div>
        </div>

    ) ;
} ;

const SectionSeperator = () => {
    return(
        <div className={styles.sep}>
        </div>
    ) ;
} ;

const InformationalContent = () => {
    return(
        <>
        <Container fluid className={styles.info_container} style={{backgroundColor: "rgba(255, 255, 255, 1)"}}>
            <Row xs={1} sm={1} md={1} lg={1} className={styles.info_container_row}>
                <Col className={styles.info_container_name}>
                ━ Imperial Valley Rural Heat Data and Alarm System ━
                </Col>
            </Row>
            <Row xs={1} sm={1} md={1} lg={1} className={styles.info_container_row}>
                <Col className={styles.info_container_tagline}>
                    Powering Data Accessibility for the Imperial Valley and its Surrounding Communities
                </Col>
            </Row>
        </Container>

        <Container fluid className={styles.info_container}>
            <Row xs={1} sm={1} md={2} lg={2} xlg={3} className={styles.info_container_row}>
                <Col s={8} md={5} lg={5} xlg={3} className={styles.info_container_col}>
                    <Image src={"/satellite-orbiting-earth.png"} fluid width={"100%"} alt={"Satellite Orbiting Earth | Premier Analytics Consulting, LLC"} 
                        style={{borderRadius: "2rem", }} />
                    <h2>
                        <BsKey className={styles.info_container_icon} />
                        Climate Data Anywhere, Anytime, on Any Device
                    </h2>
                    <h5>
                        Unparalleled Delivery, Visualization, and Analysis of Global Climate Data
                    </h5>
                    <p>
                        Experience diverse repositories of climate, infrastructure, and socioeconomic datasets without {" "}
                        purchasing any costly software, third-party addons, or programming language knowledge. {" "}
                    </p>
                    <p>
                        iCHARM allows anyone to interact with, visualize, and analyze data directly inside of their web browser. {" "}
                    </p>
                    <p>
                        In today's world, data needs to be accessed from anywhere, at anytime, and on any device. {" "}
                        Whether you're on a desktop, laptop, smartphone, tablet, or monitor, iCHARM's versatility {" "}
                        delivers the data to wherever you are. All you need is your favorite web browser and a stable internet connection.
                    </p>
                </Col>
                <Col s={8} md={5} lg={5} xlg={3} className={styles.info_container_col}>
                    <Image src={"/hand-globe-connection.png"} fluid width={"100%"} alt={"Data in Your Hands | Premier Analytics Consulting, LLC"} 
                        style={{borderRadius: "2rem", }} />
                    <h2>
                        <IoCloudDoneOutline className={styles.info_container_icon} />
                        Unparalleled Climate Data Accessibility
                    </h2>
                    <h5>
                        Connecting Users with Climate Data Spanning the Entire Globe
                    </h5>
                    <p>
                        Simplifying complex data processing is our priority. iCHARM does the tedious work of data integration for you. {""} 
                        Built on a suite of specialized high-speed cloud pipelines, climate records spanning the entire globe are {" "}
                        delivered directly to the user at the push of a button. {" "}
                    </p>
                    <p>
                        iCHARM integrates and processes these diverse sets of climate {" "}
                        records into one coherent ecosystem regardless of the data's original type, format, and structure. {" "}
                    </p>
                    <p>
                        And we're not stopping there. iCHARM is pushing the boundaries of data access {" "}
                        by developing more pipelines integrating new datasets, features, and capabilities {" "}
                        that further enhance and empower user-driven analysis.
                    </p>
                </Col>
                <Col s={10} md={5} lg={5} xlg={3} className={styles.info_container_col}>
                    <Image src={"/new-york-city-storm.png"} fluid width={"100%"} alt={"New York City | Premier Analytics Consulting, LLC"}
                        style={{borderRadius: "2rem", }}  />
                    <h2>
                        <PiWall className={styles.info_container_icon} />
                        Data-Driven Climate Resilience
                    </h2>
                    <h5>
                        Building a Climate-Ready Nation through User-Driven Insights
                    </h5>
                    <p>
                        As the severity from climate change impacts on communities, infrastructure, and investments across the globe {" "}
                        grows, the CHARM ecosystem is dedicated to mitigating those adverse effects through data-driven {" "}
                        climate resilience efforts to better inform stakeholders and keep communities safe.
                    </p>
                    <p>
                        By integrating diverse collections of global and localized climate data together into one application, {" "}
                        iCHARM allows any user to investigate the combined impacts of climate variables {" "} 
                        at specific times on communities across the United States.
                    </p>
                    <p>
                        This multivariate spatiotemporal analysis is unparalleled. By bringing together these data sources into one ecosystem, {" "}
                        iCHARM is paving the way for new climate resilience solutions that contribute to America's standing as a climate-ready nation.
                    </p>
                </Col>
                <Col md={5} lg={5} xlg={3} className={styles.info_container_col}>
                    <Image src={"/infrastructure-communities.png"} fluid width={"100%"} alt={"Houston, Texas | Premier Analytics Consulting, LLC"}
                        style={{borderRadius: "2rem", }}  />
                    <h2>
                        <BsBuildings className={styles.info_container_icon} />
                        Communities and Climate Change
                    </h2>
                    <h5>
                        Protecting U.S. Communities, Industry, and Commerce from Climate Impacts
                    </h5>
                    <p>
                        Climate resilience is moving forward by securing and fortifying communities, investments, and infrastructure across the 
                        United States and on a global scale.

                        By protecting and securing the nation's investments from extreme climate phonemena, CHARM seeks to give 
                        decisionmakers and policymakers intuitive tools for working directly with climate, scoio-economic, and
                        infrastructure data in one application.
                    </p>
                </Col>
            </Row>
        </Container>
        </>
    ) ;
}


// Main HomePage Component (sent to app.jsx)
export function HomePage() {
    return(
        <>

        <NavMenu showDev={true} />

        <Hero />

        <SectionSeperator />

        <InformationalContent />

        </>
    ) ;
}