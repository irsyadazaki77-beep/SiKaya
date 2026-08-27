import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Direct page imports for reliable route rendering and zero dynamic import chunk failures
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { LoginPage } from './pages/LoginPage';
import { ClassroomPage } from './pages/ClassroomPage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';
import { SimulationPage } from './pages/SimulationPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { CommunityPage } from './pages/CommunityPage';
import { NewsPage } from './pages/NewsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LifeSimulatorPage } from './pages/LifeSimulatorPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="features" element={<FeaturesPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="belajar" element={<ClassroomPage />} />
                  <Route path="ai-advisor" element={<AiAdvisorPage />} />
                  <Route path="simulasi" element={<SimulationPage />} />
                  <Route path="portfolio" element={<PortfolioPage />} />
                  <Route path="community" element={<CommunityPage />} />
                  <Route path="news" element={<NewsPage />} />
                  <Route path="leaderboard" element={<LeaderboardPage />} />
                  <Route path="life-simulator" element={<LifeSimulatorPage />} />
                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
