import { Routes, Route, Link } from 'react-router-dom';
import Longform from './pages/longform.jsx';
import MulChoice from './pages/mulChoice.jsx';
import Home from './pages/home.jsx'; 
import Filters from './pages/filters.jsx';
import longformIcon from '/assets/longform.svg';
import multiplechoiceIcon from '/assets/multiplechoice.svg';
import filterIcon from '/assets/filter.svg';
import statsIcon from '/assets/stats.svg';
import hamburgerIcon from '/assets/hamburger.svg';
import expandedIcon from '/assets/arrow.svg';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { DatabaseProvider } from './databaseContext';
import { Capacitor } from '@capacitor/core';
import { FilterProvider } from './filterContext.jsx';

if (Capacitor.getPlatform() === 'web') {
  import('@capacitor-community/sqlite')
    .then(module => {
      const { defineCustomElements } = module;
      if (typeof defineCustomElements === 'function') {
        defineCustomElements(window);
      } else {
        console.warn('defineCustomElements is not exported; falling back.');
      }
    })
    .catch(err => {
      console.error('Failed to load sqlite web component:', err);
    });
}

function App() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <FilterProvider>
      <DatabaseProvider>
        <div className={darkMode ? "dark-mode" : ""}>      
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/longform" element={<Longform />} />
            <Route path="/multiple-choice" element={<MulChoice />} />
            <Route path="/filters" element={<Filters />} /> 
          </Routes>
          
          <nav className='navbar'>
            <NavLink
              to="/multiple-choice"
              className={({ isActive }) => `icon-wrapper ${isActive ? 'active' : ''}`}
            >
              <img src={multiplechoiceIcon} alt="longformIcon" />
            </NavLink>

            <NavLink
              to="/stats"
              className={({ isActive }) => `icon-wrapper ${isActive ? 'active' : ''}`}
            >
              <img src={statsIcon} alt="statsIcon" />
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
              to="/filters"
              className={({ isActive }) => `icon-wrapper ${isActive ? 'active' : ''}`}
            >
              <img src={filterIcon} alt="filterIcon" />
            </NavLink>

            <NavLink
              to="/longform"
              className={({ isActive }) => `icon-wrapper ${isActive ? 'active' : ''}`}
            >
              <img src={longformIcon} alt="longformIcon" />
            </NavLink>
          </nav>
        </div>
      </DatabaseProvider>
    </FilterProvider>
  )
}

export default App;