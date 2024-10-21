// --------------------------------------------------------------------------------------- //
//  Frontend App URL Routing and Paths                                                     //
// ~ Using React-Router to Create a Multipage Application ~                                //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// React-Router
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import HomePage
import { HomePageNew } from "./components/HomePage/HomePageNew";

// Import Main App
import { default as MainApp } from "./components/MainApp/MainApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageNew />} />
        <Route path="/app" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
