import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer/Footer';
import { PageSpinner } from '@/components/ui/Skeletons';
import { Preloader } from '@/components/ui/Preloader';
import { AppProvider } from '@/context/AppContext';
import { ScrollToTop } from '@/components/ScrollToTop';

const GOLD = '#C9A84C';
const NAVY = '#0B1120';


// Route-level code splitting
const HomePage = lazy(() => import('@/pages/Home/HomePage'));

const StubPage = (title: string) =>
  function Page() {
    return (
      <main style={{ minHeight: '100vh', paddingTop: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', transition: 'background-color 0.3s' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', transition: 'color 0.3s' }}>{title}</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)', marginBottom: '1.5rem', transition: 'color 0.3s' }}>Full page coming soon.</p>
          <a href="/" style={{ fontFamily: 'Inter, sans-serif', background: `linear-gradient(135deg, ${GOLD}, #E6C97A)`, color: NAVY, padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
            Back to Home
          </a>
        </div>
      </main>
    );
  };

const AboutPage = lazy(() => import('@/pages/About/Aboutpage'));
const ContactPage = lazy(() => import('@/pages/Contact/Contactpage'));
const PrivacyPage = lazy(() => Promise.resolve({ default: StubPage('Privacy Policy') }));
const TermsPage = lazy(() => Promise.resolve({ default: StubPage('Terms of Service') }));

// New dynamic pages
const PropertiesPage = lazy(() => import('@/pages/Properties/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('@/pages/Properties/PropertyDetailsPage'));

// Admin pages
const AdminLayout = lazy(() => import('@/pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/Admin/AdminDashboard'));
const AdminProperties = lazy(() => import('@/pages/Admin/AdminProperties'));
const AdminEnquiries = lazy(() => import('@/pages/Admin/AdminEnquiries'));
const AdminPropertyUpload = lazy(() => import('@/pages/Admin/AdminPropertyUpload'));
const AdminPropertyView = lazy(() => import('@/pages/Admin/AdminPropertyView'));

const NotFound = () => (
  <main style={{ minHeight: '100vh', paddingTop: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', transition: 'background-color 0.3s' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', transition: 'color 0.3s' }}>404</h1>
      <p style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)', marginBottom: '1.5rem', transition: 'color 0.3s' }}>Page not found.</p>
      <a href="/" style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C97A)`, color: NAVY, padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
        Go Home
      </a>
    </div>
  </main>
);

// Public Layout to include Navbar and Footer
const PublicLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    } as any);

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <AppProvider>
      <div className="global-animated-bg" aria-hidden="true" />
      <Preloader />
      <BrowserRouter>
        <ScrollToTop />
        {/* Skip to main content for keyboard users */}
        <a
          href="#main-content"
          style={{
            position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden',
          }}
          onFocus={(e) => { const el = e.currentTarget as HTMLElement; el.style.position = 'fixed'; el.style.left = '1rem'; el.style.top = '1rem'; el.style.zIndex = '9999'; el.style.width = 'auto'; el.style.height = 'auto'; }}
          onBlur={(e) => { const el = e.currentTarget as HTMLElement; el.style.position = 'absolute'; el.style.left = '-9999px'; el.style.width = '1px'; el.style.height = '1px'; }}
        >
          Skip to main content
        </a>

        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* Public website routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Admin control panel routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="upload" element={<AdminPropertyUpload />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/view/:id" element={<AdminPropertyView />} />
              <Route path="properties/new" element={<AdminPropertyUpload />} />
              <Route path="properties/edit/:id" element={<AdminPropertyUpload />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;