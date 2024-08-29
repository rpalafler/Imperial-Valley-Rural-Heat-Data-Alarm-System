import { useState, createContext } from 'react';
import { NavMenu } from '../NavMenu/NavMenu';
import SubHeader from './DeckInterface/SubHeader/SubHeader';
import DeckInterface from './DeckInterface/DeckInterface';
import Sidebar from './Sidebar/Sidebar';
import TimeSeriesChart from './TimeSeries/TimeSeriesChart';
import './MainApp.css';

export const SidebarContext = createContext();

function MainApp() {
  const [sidebarState, setSidebarState] = useState(false);

  return (
    <div className="main-app">
      <NavMenu showDev={false} />
      <SidebarContext.Provider value={{ sidebarState, setSidebarState }}>
        <SubHeader />
        <Sidebar />
      </SidebarContext.Provider>
      <div className="deck-interface">
        <DeckInterface />
      </div>
      <div className="chart-container">
        <TimeSeriesChart />
      </div>
    </div>
  );
}

export default MainApp;
