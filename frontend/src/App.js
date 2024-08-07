
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
