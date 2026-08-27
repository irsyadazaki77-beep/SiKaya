import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageLoadingFallback } from './components/ui/PageLoadingFallback';

// Eagerly loaded for instantaneous initial paint & auth access
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

// Lazy-loaded routes for optimal initial bundle size and on-demand code splitting
const ClassroomPage = lazy(() =>
  import('./pages/ClassroomPage').then(m => ({ default: m.ClassroomPage }))
);
const AiAdvisorPage = lazy(() =>
  import('./pages/AiAdvisorPage').then(m => ({ default: m.AiAdvisorPage }))
);
const SimulationPage = lazy(() =>
  import('./pages/SimulationPage').then(m => ({ default: m.SimulationPage }))
);
const PortfolioPage = lazy(() =>
  import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage }))
);
const CommunityPage = lazy(() =>
  import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage }))
);
const NewsPage = lazy(() =>
  import('./pages/NewsPage').then(m => ({ default: m.NewsPage }))
);
const LeaderboardPage = lazy(() =>
  import('./pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage }))
);
const LifeSimulatorPage = lazy(() =>
  import('./pages/LifeSimulatorPage').then(m => ({ default: m.LifeSimulatorPage }))
);
const FeaturesPage = lazy(() =>
  import('./pages/FeaturesPage').then(m => ({ default: m.FeaturesPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
);

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoadingFallback />}>
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
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
