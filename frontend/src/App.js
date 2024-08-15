// --------------------------------------------------------------------------------------- //
//  Frontend App URL Routing and Paths                                                     //
// ~ Using React-Router to Create a Multipage Application ~                                //
// --------------------------------------------------------------------------------------- //
//  Ryan Paul Lafler, M.Sc.                                                                //
//  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              //
//  E-mail: rplafler@premier-analytics.com                                                 //
// --------------------------------------------------------------------------------------- //

// React-Router
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom" ;

// Import HomePage
import { HomePage } from "./components/HomePage/HomePage" ;

// Import Main App
import { default as MainApp } from './components/MainApp/MainApp' ;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/app' element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
