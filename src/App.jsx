import { Routes, Route, Link } from 'react-router-dom';
import Longform from './pages/longform.jsx';
import MulChoice from './pages/mulChoice.jsx';
import longformIcon from '/assets/longform.svg';
import multiplechoiceIcon from '/assets/multiplechoice.svg';
import hamburgerIcon from '/assets/hamburger.svg';
import { useState } from 'react';


function App() {

  const [active, setActive] = useState(0);

  return (
    <div>
      <Routes>
        <Route path="/longform" element={<Longform />} />
        <Route path="/mulchoice" element={<MulChoice />} />
      </Routes>

      <nav className='navbar'>
        <div
        className={`icon-wrapper ${active === "multiplechoice" ? "active" : ""}`}
        onClick={() => setActive("multiplechoice")}
        >
          <img src={multiplechoiceIcon} alt="multiplechoiceIcon" />
        </div> 
        <div
        >
          <img src={hamburgerIcon} alt="hamburgerIcon" />
        </div>
        <div
        className={`icon-wrapper ${active === "longform" ? "active" : ""}`}
        onClick={() => setActive("longform")}
        >
          <img src={longformIcon} alt="longformIcon" />
        </div>
      </nav>

      
    </div>
  )
}

export default App;