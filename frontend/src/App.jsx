import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Longform from './pages/longform';
import MulChoice from './pages/mulchoice';
import './App.css'; // Optional, for custom styles

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <div className="content">
        <Routes location={location}>
          <Route path="/longform" element={<Longform />} />
          <Route path="/multiple-choice" element={<MulChoice />} />
        </Routes>
      </div>

      <nav className="tab-bar">
        <Link to="/longform" className={location.pathname === 'longform' ? 'active' : ''}>Longform</Link>
        <Link to="/multiple-choice" className={location.pathname === '/multiple-choice' ? 'active' : ''}>Multiple Choice</Link>
      </nav>
    </div>
  );
}
export default App;
