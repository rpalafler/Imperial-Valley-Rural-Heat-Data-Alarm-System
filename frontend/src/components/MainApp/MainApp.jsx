// --------------------------------------------------------------------------------------- //
//  Main Interactive Dashboard Interface                                                   //
// ~ Contains NavMenu, SubHeader, DeckGL Interface, Pullup Tab Components ~                //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// Import React Hooks
import { useState, useEffect, createContext } from "react";

// App Component Imports
import { NavMenu } from "../NavMenu/NavMenu";
import { default as SubHeader } from "./SubHeader/SubHeader";
import { default as DeckInterface } from "./DeckInterface/DeckInterface";
import { default as Sidebar } from "./Sidebar/Sidebar";
import { default as PullupTab } from "./PullupTab/PullupTab";

// Create Context --> Transmit information across components from parent to children //
export const SidebarContext = createContext(); // Sidebar Context
export const ClimateDataContext = createContext(); // Climate Data Selections
export const RTMAContext = createContext(); // RTMA Data
export const SensorContext = createContext(); // Sensor Data

function MainApp() {
  // Across App Functionality States
  const [sidebarState, setSidebarState] = useState(false);
  function toggleSidebar() {
    setSidebarState(!sidebarState);
  }

  // ****************************************************************************** //
  //                   **** CLIMATE DATA QUERYING TAB ****                          //
  // ****************************************************************************** //
  // Turn Selected Climate Datasets ON / OFF
  const [climateDataOn, setClimateDataOn] = useState({});
  // OPEN / CLOSE Climate Data Querying Tab //
  const [climateDataTabOn, setClimateDataTabOn] = useState(false);

  // ****************************************************************************** //
  //                         **** RTMA DATA ****                                    //
  // ****************************************************************************** //
  const [rtmaForm, setRtmaForm] = useState(null);
  const [rtmaLoading, setRtmaLoading] = useState(false);
  const [rtmaData, setRtmaData] = useState(null);

  // ****************************************************************************** //
  //          **** SENSOR DATA ****  STORE STATES INSIDE OF A COMPONENT             //
  // ****************************************************************************** //
  const [sensorForm, setSensorForm] = useState(null);
  const [sensorLoading, setSensorLoading] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [sensorPoint, setSensorPoint] = useState(null); // Time Series React State for location (clicked point)
  const [sensorPullUp, setSensorPullUp] = useState(false);
  const [sensorTimeSeries, setSensorTimeSeries] = useState(null);
  // Global variable that opens & closes the tab on click
  const [sensorTabOpen, setSensorTabOpen] = useState(false);

  return (
    <>
      <NavMenu showDev={false} />
      <SidebarContext.Provider value={{ sidebarState, setSidebarState }}>
        <ClimateDataContext.Provider
          value={{
            climateDataOn,
            setClimateDataOn,
            climateDataTabOn,
            setClimateDataTabOn,
          }}
        >
          <RTMAContext.Provider
            value={{
              rtmaForm,
              setRtmaForm,
              rtmaData,
              setRtmaData,
              rtmaLoading,
              setRtmaLoading,
            }}
          >
            {/* Connect context to child components and specify states defined in parent 
            (MainApp) for global states */}
            <SensorContext.Provider
              value={{
                sensorForm,
                setSensorForm,
                sensorData,
                setSensorData,
                sensorLoading,
                setSensorLoading,
                sensorPoint,
                setSensorPoint,
                sensorPullUp,
                setSensorPullUp,
                sensorTimeSeries,
                setSensorTimeSeries,
                sensorTabOpen,
                setSensorTabOpen,
              }}
            >
              <SubHeader />
              <Sidebar />
              <DeckInterface />
              <PullupTab />
            </SensorContext.Provider>
          </RTMAContext.Provider>
        </ClimateDataContext.Provider>
      </SidebarContext.Provider>
    </>
  );
}

export default MainApp;
