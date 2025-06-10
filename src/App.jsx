import { Routes, Route, Link } from 'react-router-dom';
import Longform from './pages/longform.jsx';
import MulChoice from './pages/mulChoice.jsx';

function App() {
  return (
    <div>
      <nav>
        <Link to='/longform'>Longform Questions</Link> | <Link to='/mulchoice'>Multiple Choice</Link>
      </nav>

      <Routes>
        <Route path="/longform" element={<Longform />} />
        <Route path="/mulchoice" element={<MulChoice />} />
      </Routes>
    </div>
  )
}

export default App;