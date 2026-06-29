import React from 'react';
import { useGsapScrollReveal, useGsapTextScroll } from '@/utils/animations';
import { Handshake, Building2, Lightbulb, ShieldCheck, Calendar, Home, Users, MapPin } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useCounter } from '@/hooks/useCounter';
import { STATS, SERVICE_FEATURES } from '@/utils/constants';
import type { Stat } from '@/utils/constants';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E6C97A';
const NAVY = '#0B1120';

const featureIcons: Record<string, React.ReactNode> = {
  handshake: <Handshake className="w-6 h-6" style={{ color: GOLD }} aria-hidden="true" />,
  building: <Building2 className="w-6 h-6" style={{ color: GOLD }} aria-hidden="true" />,
  lightbulb: <Lightbulb className="w-6 h-6" style={{ color: GOLD }} aria-hidden="true" />,
  shield: <ShieldCheck className="w-6 h-6" style={{ color: GOLD }} aria-hidden="true" />,
};

const statIcons: Record<string, React.ReactNode> = {
  calendar: <Calendar className="w-8 h-8" style={{ color: GOLD_LIGHT }} aria-hidden="true" />,
  home: <Home className="w-8 h-8" style={{ color: GOLD_LIGHT }} aria-hidden="true" />,
  users: <Users className="w-8 h-8" style={{ color: GOLD_LIGHT }} aria-hidden="true" />,
  'map-pin': <MapPin className="w-8 h-8" style={{ color: GOLD_LIGHT }} aria-hidden="true" />,
};

const FeatureCard = React.memo(({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) => (
  <div
    className="reveal-item"
    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', flexShrink: 0 }}>
      {featureIcons[icon]}
    </div>
    <div>
      <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.25rem', transition: 'color 0.2s' }}>{title}</h3>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, transition: 'color 0.2s' }}>{description}</p>
    </div>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

const StatCard = React.memo(({ stat, isActive }: { stat: Stat; isActive: boolean }) => {
  const count = useCounter(stat.value, 2000, isActive);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
      {statIcons[stat.icon]}
      <div
        style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', fontSize: 'clamp(2rem, 4vw, 2.75rem)', lineHeight: 1 }}
        aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
      >
        {count}<span style={{ color: GOLD_LIGHT }}>{stat.suffix}</span>
      </div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#d1d5db', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</p>
    </div>
  );
});
StatCard.displayName = 'StatCard';

export const WhyChooseUs: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [statsRef, statsInView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [isMobile, setIsMobile] = React.useState(false);
  
  useGsapScrollReveal(sectionRef);
  useGsapTextScroll(sectionRef);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section ref={sectionRef} className="pt-8 pb-8 md:pt-10 md:pb-10 lg:pt-12 lg:pb-12" style={{ background: 'var(--bg-primary)', transition: 'background-color 0.3s' }} aria-labelledby="why-choose-us-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div>
            <p
              className="text-reveal"
              style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.75rem' }}
            >
              Why Choose Us
            </p>
            <h2
              id="why-choose-us-heading"
              className="text-reveal gold-underline"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2.5rem', display: 'inline-block', transition: 'color 0.3s' }}
            >
              We Provide The Best Service
            </h2>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-6" style={{ marginTop: '2rem' }}>
              {SERVICE_FEATURES.map((feature, idx) => (
                <FeatureCard key={feature.id} icon={feature.icon} title={feature.title} description={feature.description} index={idx} />
              ))}
            </div>
          </div>

          {/* Right: Stats */}
          <div
            ref={statsRef}
            className="reveal-item"
            style={{ borderRadius: '1rem', padding: '2.5rem', background: NAVY }}
            aria-label="Company statistics"
          >
            <div className="grid grid-cols-2 gap-8 md:gap-10">
              {STATS.map((stat) => (
                <StatCard key={stat.id} stat={stat} isActive={statsInView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
