import { Routes, Route, Link } from 'react-router-dom';
import Longform from './pages/longform.jsx';
import MulChoice from './pages/mulChoice.jsx';
import Home from './pages/Home.jsx'; 
import longformIcon from '/assets/longform.svg';
import multiplechoiceIcon from '/assets/multiplechoice.svg';
import hamburgerIcon from '/assets/hamburger.svg';
import expandedIcon from '/assets/arrow.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark-mode" : ""}>      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/longform" element={<Longform />} />
        <Route path="/multiple-choice" element={<MulChoice />} />
      </Routes>
      
      <nav className='navbar'>
        <NavLink
          to="/multiple-choice"
          className={({ isActive }) => `icon-wrapper ${isActive ? 'active' : ''}`}
        >
          <img src={multiplechoiceIcon} alt="longformIcon" />
        </NavLink>
        <div className="burgermenu">
          <img
            src={showPopup ? expandedIcon : hamburgerIcon}
            alt={showPopup ? "expandedIcon" : "hamburgerIcon"}
            onClick={() => setShowPopup(v => !v)}
          />
          {showPopup && (
            <div className="popup-menu">
              <button className='ReturnHome' onClick={() => { setActive(""); navigate('/'); setShowPopup(false); }}>Home</button>
              <button className='DarkMode' onClick={() => setDarkMode(dm => !dm)}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          )}
        </div>
         <NavLink
          to="/longform"
          className={({ isActive }) => `icon-wrapper ${isActive ? 'active' : ''}`}
        >
          <img src={longformIcon} alt="longformIcon" />
        </NavLink>
      </nav>

      
    </div>
  )
}

export default App;