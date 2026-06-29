import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star, Sun, Moon, Phone } from 'lucide-react';
import { NAV_LINKS, PHONE_NUMBER, PHONE_HREF } from '@/utils/constants';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AdminNavButton } from '@/pages/Admin/AdminPropertyUpload';

const NAVY = '#0B1120';
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E6C97A';

const Logo = React.memo(({ isMobile, useLightText }: { isMobile: boolean; useLightText: boolean }) => (
  <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="New Star Real Estate Home" style={{ textDecoration: 'none' }}>
    <Star className={isMobile ? 'w-8.5 h-8.5' : 'w-9 h-9'} style={{ color: GOLD, fill: GOLD, filter: 'drop-shadow(0 0 5px rgba(201, 168, 76, 0.45))' }} aria-hidden="true" />
    <div className="flex flex-col leading-none">
      <span 
        style={{ 
          color: useLightText ? '#FFFFFF' : '#0B1120',
          textShadow: useLightText ? '0px 2px 4px rgba(0,0,0,0.5)' : 'none',
          fontFamily: '"Playfair Display", serif', 
          fontWeight: 700, 
          fontSize: isMobile ? '1rem' : '1.25rem', 
          letterSpacing: '0.1em',
          transition: 'color 0.3s'
        }}
      >
        NEW STAR
      </span>
      <span style={{ color: useLightText ? GOLD_LIGHT : GOLD, fontFamily: 'Inter, sans-serif', fontSize: isMobile ? '0.55rem' : '0.625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'color 0.3s' }}>
        Real Estate
      </span>
    </div>
  </Link>
));
Logo.displayName = 'Logo';

const NavLink = React.memo(({ href, label, useLightText }: { href: string; label: string; useLightText: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      to={href}
      className="relative px-4 py-2 rounded-full transition-all duration-300 select-none text-xs font-bold uppercase tracking-wider"
      style={{
        fontFamily: 'Inter, sans-serif',
        color: isActive ? GOLD : (useLightText ? '#FFFFFF' : '#0B1120'),
        textDecoration: 'none',
        background: isActive 
          ? (useLightText ? 'rgba(201, 168, 76, 0.12)' : 'rgba(201, 168, 76, 0.08)')
          : (isHovered ? (useLightText ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 'transparent'),
        border: isActive ? '1px solid rgba(201, 168, 76, 0.3)' : '1px solid transparent',
        textShadow: useLightText && !isActive ? '0 2px 4px rgba(0,0,0,0.8)' : (useLightText && isActive ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'),
      }}
      aria-current={isActive ? 'page' : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </Link>
  );
});
NavLink.displayName = 'NavLink';

const DarkModeToggle = ({ isDark, toggleDarkMode, useLightText }: { isDark: boolean, toggleDarkMode: () => void, useLightText: boolean }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(iconRef.current, { rotate: isDark ? 360 : 0, duration: 0.5 });
  }, [isDark]);

  return (
    <button 
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer"
      style={{
        background: useLightText ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        border: useLightText ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
      }}
      aria-label="Toggle Dark Mode"
    >
      <div 
        ref={iconRef}
        onMouseEnter={() => gsap.to(iconRef.current, { rotate: isDark ? 360 + 15 : 15, duration: 0.2 })}
        onMouseLeave={() => gsap.to(iconRef.current, { rotate: isDark ? 360 : 0, duration: 0.2 })}
      >
        {isDark ? (
          <Sun className="w-4.5 h-4.5" style={{ color: GOLD_LIGHT }} />
        ) : (
          <Moon className="w-4.5 h-4.5" style={{ color: useLightText ? '#FFFFFF' : NAVY }} />
        )}
      </div>
    </button>
  );
};

const MobileMenu = React.memo(({ isOpen, onClose, isDark, toggleDarkMode }: { isOpen: boolean; onClose: () => void; isDark: boolean; toggleDarkMode: () => void }) => {
  const location = useLocation();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const navListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (shouldRender) {
      // Animate out
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power2.in', onComplete: () => setShouldRender(false) });
    }
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen && shouldRender) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.3, ease: 'power2.out' });
      if (navListRef.current) {
        gsap.fromTo(navListRef.current.children, 
          { opacity: 0, x: 20 }, 
          { opacity: 1, x: 0, stagger: 0.06, duration: 0.3, delay: 0.1 }
        );
      }
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        ref={drawerRef}
        className="fixed right-0 top-0 z-50 h-full flex flex-col"
        style={{ 
          width: '18rem', 
          background: isDark ? NAVY : '#FFFFFF', 
          boxShadow: '-10px 0 40px rgba(0,0,0,0.2)' 
        }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)' }}>
          <Logo isMobile={true} useLightText={isDark} />
          
          <div className="flex items-center gap-3">
            <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} useLightText={isDark} />

            <button
              onClick={onClose}
              aria-label="Close mobile menu"
              className="rounded-full w-9 h-9 flex items-center justify-center"
              style={{ 
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', 
                transition: 'all 0.2s', 
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' 
              }}
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <ul ref={navListRef} className="flex flex-col p-5 gap-2 flex-1" role="list">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={onClose}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-bold tracking-wider uppercase"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'none',
                    background: isActive ? (isDark ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.08)') : 'transparent',
                    color: isActive ? GOLD : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(11,17,32,0.8)'),
                    border: isActive ? `1px solid rgba(201,168,76,0.3)` : '1px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="p-5 space-y-4" style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)' }}>
          <a href={PHONE_HREF} onClick={onClose} className="flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-[1.02]" 
            style={{ 
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #C9A84C 0%, #E6C97A 50%, #C9A84C 100%)',
              color: NAVY,
              boxShadow: '0 4px 15px rgba(201, 168, 76, 0.3)'
            }}>
            <Phone className="w-4 h-4" />
            {PHONE_NUMBER}
          </a>

          <AdminNavButton />
        </div>
      </nav>
    </>
  );
});
MobileMenu.displayName = 'MobileMenu';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isDark, setIsDark] = React.useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const [isScrolled, setIsScrolled] = React.useState(false);
  const headerRef = useRef<HTMLElement>(null);

  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const isDarkMode = document.documentElement.classList.toggle('dark');
    setIsDark(isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  };

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMenu = React.useCallback(() => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMenu = React.useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  const location = useLocation();
  const useLightText = isDark || !isScrolled;

  return (
    <>
      <header
        ref={headerRef}
        className="fixed z-30 transition-all duration-500"
        style={{
          top: isMobile ? '0px' : '16px',
          left: '0px',
          right: '0px',
          margin: '0 auto',
          width: isMobile ? '100%' : 'calc(100% - 2rem)',
          maxWidth: isMobile ? '100%' : '1280px',
          background: !isScrolled 
            ? 'rgba(255, 255, 255, 0.1)' 
            : (isDark ? 'rgba(11, 17, 32, 0.85)' : 'rgba(255, 255, 255, 0.95)'),
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: isMobile ? '0' : '1rem',
          borderBottom: isMobile ? (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)') : 'none',
          border: isMobile ? 'none' : (useLightText ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.05)'),
          boxShadow: useLightText 
            ? '0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : '0 8px 30px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        }}
        role="banner"
      >
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between" style={{ height: isMobile ? '3.5rem' : '4.5rem', transition: 'height 300ms' }}>
            
            <Logo isMobile={isMobile} useLightText={useLightText} />

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} useLightText={useLightText} />
              ))}
            </nav>

            {/* Desktop Right (Streamlined) */}
            <div className="hidden lg:flex items-center gap-4">
              <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} useLightText={useLightText} />

              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 hover:scale-[1.03]"
                style={{ 
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E6C97A 50%, #C9A84C 100%)',
                  color: NAVY,
                  boxShadow: '0 4px 15px rgba(201, 168, 76, 0.3)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 168, 76, 0.45)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(201, 168, 76, 0.3)'}
                aria-label={`Call us at ${PHONE_NUMBER}`}
              >
                <Phone className="w-3.5 h-3.5" style={{ color: NAVY }} />
                {PHONE_NUMBER}
              </a>

              <AdminNavButton />
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
              onClick={openMenu}
              aria-label="Open mobile menu"
              aria-expanded={menuOpen}
              style={{ 
                color: useLightText ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)', 
                background: useLightText ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', 
                border: useLightText ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', 
                transition: 'all 0.2s', cursor: 'pointer' 
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} isDark={isDark} toggleDarkMode={toggleDarkMode} />
    </>
  );
};