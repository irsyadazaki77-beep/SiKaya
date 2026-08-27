import { useAuth } from '../context/AuthContext';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { HeroSection } from '../components/home/HeroSection';
import { SimulationSection } from '../components/home/SimulationSection';
import { DreamPlannerSection } from '../components/home/DreamPlannerSection';
import { BentoSpotlightSection } from '../components/home/BentoSpotlightSection';
import { WhyUsSection } from '../components/home/WhyUsSection';
import { TrustSection } from '../components/home/TrustSection';
import { StatsSection } from '../components/home/StatsSection';
import { MarketNewsSection } from '../components/home/MarketNewsSection';
import { FAQSection } from '../components/home/FAQSection';
import { CtaBannerSection } from '../components/home/CtaBannerSection';

export function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-teal-650 dark:text-teal-400">
        <div className="relative flex items-center justify-center mb-4">
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-teal-400 dark:bg-teal-500 opacity-20 animate-ping"></span>
          <svg className="animate-spin h-7 w-7 text-teal-600 dark:text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest animate-pulse font-mono text-slate-500 dark:text-slate-400">
          Memuat Data Dasbor...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {user ? (
        <UserDashboard />
      ) : (
        <>
          <HeroSection />
          <SimulationSection />
          <DreamPlannerSection />
          <BentoSpotlightSection />
          <WhyUsSection />
          <TrustSection />
          <StatsSection />
          <MarketNewsSection />
          <FAQSection />
          <CtaBannerSection />
        </>
      )}
    </div>
  );
}

