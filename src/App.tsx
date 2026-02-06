import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { LandingPage } from './pages/LandingPage';
import { SummaryPage } from './pages/SummaryPage';
import { Stage1 } from './components/stage1/Stage1';
import { Stage2 } from './components/stage2/Stage2';
import { Stage3Packages } from './components/stage3/Stage3Packages';
import { Stage3Customize } from './components/stage3/Stage3Customize';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/stage1" element={<Stage1 />} />
          <Route path="/stage2" element={<Stage2 />} />
          <Route path="/stage3/packages" element={<Stage3Packages />} />
          <Route path="/stage3/customize" element={<Stage3Customize />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
