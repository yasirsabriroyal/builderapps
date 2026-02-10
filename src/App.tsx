import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { SummaryPage } from './pages/SummaryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { FloorPlanPage } from './pages/FloorPlanPage';
import { Viewer3DPage } from './pages/Viewer3DPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { BudgetPage } from './pages/BudgetPage';
import { TimelinePage } from './pages/TimelinePage';
import { DocumentsPage } from './pages/DocumentsPage';
import { CollaborationPage } from './pages/CollaborationPage';
import { Stage1 } from './components/stage1/Stage1';
import { Stage2 } from './components/stage2/Stage2';
import { Stage3Packages } from './components/stage3/Stage3Packages';
import { Stage3Customize } from './components/stage3/Stage3Customize';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/stage1" element={<Stage1 />} />
            <Route path="/stage2" element={<Stage2 />} />
            <Route path="/stage3/packages" element={<Stage3Packages />} />
            <Route path="/stage3/customize" element={<Stage3Customize />} />
            <Route path="/summary" element={<SummaryPage />} />
            
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/floor-plan" element={<ProtectedRoute><FloorPlanPage /></ProtectedRoute>} />
            <Route path="/3d-viewer" element={<ProtectedRoute><Viewer3DPage /></ProtectedRoute>} />
            <Route path="/materials" element={<ProtectedRoute><MaterialsPage /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
            <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
            <Route path="/collaboration" element={<ProtectedRoute><CollaborationPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
