import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Longform from './pages/Longform';
import MultipleChoice from './pages/MultipleChoice';
import './App.css'; 

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      <div className="content">
        <Routes location={location}>
          <Route path="/longform" element={<Longform />} />
          <Route path="/multiple-choice" element={<MultipleChoice/>} />
        </Routes>
      </div>

      <nav className="tab-bar">
        <Link to="/longform" className={location.pathname === '/' ? 'active' : ''}>Longform</Link>
        <Link to="/multiple-choice" className={location.pathname === '/about' ? 'active' : ''}>Multiple Choice</Link>
      </nav>

      <nav className='top-bar'>
        

      </nav>
    </div>
  );
}
export default App;
