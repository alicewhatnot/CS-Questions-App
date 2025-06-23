import { Routes, Route, Link } from 'react-router-dom';
import Longform from './pages/longform.jsx';
import MulChoice from './pages/mulChoice.jsx';
import Home from './pages/Home.jsx'; 
import longformIcon from '/assets/longform.svg';
import multiplechoiceIcon from '/assets/multiplechoice.svg';
import hamburgerIcon from '/assets/hamburger.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  return (
    <div>
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
        <div
        >
          <img src={hamburgerIcon} alt="hamburgerIcon" />
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