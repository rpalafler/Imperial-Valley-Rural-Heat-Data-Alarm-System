// --------------------------------------------------------------------------------------- //
//  Homepage (Front Page) Component                                                        //
// ~ Contains Navigation Menu, Information about Project, and Links to other Pages ~       //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// React Hook Imports
import { useState, useEffect } from "react";

// React-Router Navigation Links
import { NavLink } from "react-router-dom";

import styles from "./HomePageNew.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Navigation Menu Component
import { NavMenu } from "../NavMenu/NavMenu";

// React Icons for Content Sections
import { IoCloudDoneOutline } from "react-icons/io5";
import { BsKey } from "react-icons/bs";
import { PiWall } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";

// React-Bootstrap Responsive Layout Components
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  ResponsiveEmbed,
} from "react-bootstrap";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero_image}></div>
      <div className={styles.hero_welcome}>
        <img
          src={"imperial-valley-square-logo.png"}
          className={styles.logo_image}
        />
      </div>
      <div>
        <NavLink to={"/app"}>
          <button className={styles.inputSubmit}>Launch the App ➤</button>
        </NavLink>
      </div>
    </div>
  );
};

const SectionSeperator = () => {
  return <div className={styles.sep}></div>;
};

const InformationalContent = () => {
  return (
    <>
      <Container
        fluid
        className={styles.info_container}
        style={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
      >
        <Row xs={1} sm={1} md={1} lg={1} className={styles.info_container_row}>
          <Col className={styles.info_container_name}>
            ━ Imperial Valley Rural Heat Data and Alarm System ━
          </Col>
        </Row>
        <Row xs={1} sm={1} md={1} lg={1} className={styles.info_container_row}>
          <Col className={styles.info_container_tagline}>
            Powering Data Accessibility for the Imperial Valley and its
            Surrounding Communities
          </Col>
        </Row>
      </Container>
    </>
  );
};

// Main HomePage Component (sent to app.jsx)
export function HomePageNew() {
  return (
    <>
      <NavMenu showDev={true} />

      <Hero />

      <SectionSeperator />

      <InformationalContent />
    </>
  );
}
