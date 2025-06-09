import { Routes, Route, Link} from 'react-router-dom';
import Longform from '.pages/longform';
import MulChoice from '.pages/mulChoice';

function App() {
  return (
    <div>
      <nav>
        <link to='/longform'>Longform Questions</link> | <link to='/mulchoice'>Multiple Choice</link>
      </nav>

      <Routes>
        <Route path="/longform" element={<Longform />} />
        <Route path="/mulchoice" element={<MulChoice />} />
      </Routes>
    </div>
  )
}

export default App;