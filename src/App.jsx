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
        <div
        className={`icon-wrapper ${active === "multiple-choice" ? "active" : ""}`}
        onClick={() => {
          setActive("multiple-choice");
          navigate('/multiple-choice');
        }}
        >
          <img src={multiplechoiceIcon} alt="multiplechoiceIcon" />
        </div> 

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

        <div
        className={`icon-wrapper ${active === "longform" ? "active" : ""}`}
        onClick={() => {
          setActive("longform")
          navigate('longform')
        }}
        >
          <img src={longformIcon} alt="longformIcon" />
        </div>
      </nav>

      
    </div>
  )
}

export default App;