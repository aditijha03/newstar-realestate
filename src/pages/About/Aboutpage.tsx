import React from 'react';
import { motion } from 'framer-motion';
import hiranandaniImg from "../../assets/hiranandani-fortunecity-panvel.webp";

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E6C97A';
const NAVY = '#0B1120';

/* ─── Shared motion variants ───────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } }),
};

/* ─── 3D Tilt Card — mouse-follow perspective tilt + glare ─────────────────── */
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
}> = ({ children, className, style, maxTilt = 8, scale = 1.02, glare = true }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [rx, setRx] = React.useState(0);
  const [ry, setRy] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setRy((px - 0.5) * maxTilt * 2);
    setRx((0.5 - py) * maxTilt * 2);
    setGlarePos({ x: px * 100, y: py * 100 });
  };

  const handleLeave = () => {
    setHovered(false);
    setRx(0);
    setRy(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      animate={{
        rotateX: rx,
        rotateY: ry,
        scale: hovered ? scale : 1,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            opacity: hovered ? 0.5 : 0,
            transition: 'opacity 0.3s',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
};

/* ─── Magnetic Button — subtle cursor-follow pull + scale pop ──────────────── */
const MagneticButton: React.FC<{
  children: React.ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
}> = ({ children, href, className, style, strength = 0.25 }) => {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setOffset({ x, y });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={style}
      animate={{ x: offset.x, y: offset.y }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.a>
  );
};

/* ─── Hero ──────────────────────────────────────────────────────────────────── */
const AboutHero: React.FC = () => (
  <section
    style={{ background: NAVY }}
    className="relative overflow-hidden pt-32 sm:pt-36 lg:min-h-[380px]"
    aria-labelledby="about-hero-heading"
  >
    {/* Ambient gold glow — bottom-left */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '380px', height: '380px',
        background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}
    />

    {/* Right side image */}
    <div className="absolute right-0 top-0 bottom-0 hidden md:block md:w-1/2 lg:w-[58%]" style={{ overflow: 'hidden' }}>
      <motion.img
        src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80"
        alt="Modern building exterior"
        className="w-full object-cover"
        style={{ opacity: 0.65, position: 'absolute', inset: 0, height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {/* Left fade overlay so it blends into navy */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${NAVY} 0%, ${NAVY}99 15%, transparent 45%)`,
        }}
      />
    </div>

    {/* Content */}
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:py-28">
      <motion.p
        variants={fadeUp} initial="hidden" whileInView="show" custom={0} viewport={{ once: true }}
        style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.875rem' }}
      >
        Who We Are
      </motion.p>
      <motion.h1
        id="about-hero-heading"
        variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        About Us
      </motion.h1>
      {/* Gold underline */}
      <div className="mt-4 w-14 sm:w-16 h-[3px] rounded" style={{ background: GOLD }} />
      {/* Breadcrumb */}
      <nav className="mt-5 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm">
        <a href="/" style={{ color: '#d1d5db' }} className="hover:text-white transition-colors">
          Home
        </a>
        <span style={{ color: 'var(--text-secondary)' }}>&gt;</span>
        <span style={{ color: GOLD }}>About Us</span>
      </nav>
    </div>
  </section>
);

// ─── Who We Are ────────────────────────────────────────────────────────────────
const WhoWeAre: React.FC = () => (
  <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-navy-900 transition-colors duration-300">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" custom={0} viewport={{ once: true }}
          className="reveal-item"
        >
          <p className="text-reveal text-xs font-bold uppercase tracking-widest mb-3 sm:mb-4" style={{ color: GOLD }}>
            WHO WE ARE
          </p>
          <h2
            className="text-reveal text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6"
            style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }}
          >
            New Star Real Estate
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8" style={{ color: 'var(--text-primary)' }}>
            New Star Real Estate is a trusted real estate brokerage committed to helping
            clients find the perfect property that fits their lifestyle and investment goals.
            With years of experience in the real estate market, we specialize in
            residential, commercial, and investment properties. Our mission is to deliver
            transparent, reliable, and personalized real estate services with a client-first
            approach.
          </p>
          <MagneticButton
            href="/contact"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white rounded transition-opacity hover:opacity-90"
            style={{ background: NAVY }}
          >
            Contact Us Today
          </MagneticButton>
        </motion.div>

        {/* Right — premium image with 3D tilt */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }}>
          <TiltCard
            className="about-image-wrap"
            style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', borderRadius: '1rem' }}
            maxTilt={6}
            scale={1.015}
          >
            <motion.img
  src={hiranandaniImg}
  alt="Hiranandani Fortune City, Panvel"
  className="w-full h-full object-cover"
  loading="eager"
  whileHover={{ scale: 1.08 }}
  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
  style={{ transform: 'translateZ(0)' }}
/>
            {/* Subtle overlay for depth */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 50%, rgba(11,17,32,0.15) 100%)',
                pointerEvents: 'none',
              }}
            />
          </TiltCard>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── Mission & Values ──────────────────────────────────────────────────────────
const missionItems = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-3 sm:mb-4 w-9 h-9 sm:w-10 sm:h-10">
        <circle cx="20" cy="20" r="17" stroke={GOLD} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="10" stroke={GOLD} strokeWidth="1.4" />
        <circle cx="20" cy="20" r="3.5" fill={GOLD} />
        <line x1="20" y1="3" x2="20" y2="9" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="20" y1="31" x2="20" y2="37" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="3" y1="20" x2="9" y2="20" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="31" y1="20" x2="37" y2="20" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Our Mission',
    desc: 'To help our clients find the right property with trust, transparency, and complete satisfaction.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-3 sm:mb-4 w-9 h-9 sm:w-10 sm:h-10">
        <path d="M20 4 L34 10 L34 22 C34 29 27 35 20 37 C13 35 6 29 6 22 L6 10 Z" stroke={GOLD} strokeWidth="1.4" fill="none" />
        <path d="M14 20 L18 24 L26 16" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Our Vision',
    desc: 'To be the most trusted real estate brand known for quality service and lasting relationships.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-3 sm:mb-4 w-9 h-9 sm:w-10 sm:h-10">
        <circle cx="14" cy="14" r="6" stroke={GOLD} strokeWidth="1.4" />
        <circle cx="26" cy="14" r="6" stroke={GOLD} strokeWidth="1.4" />
        <path d="M4 36 C4 28 8 23 14 23" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M26 23 C32 23 36 28 36 36" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M14 23 C14 23 17 25 20 25 C23 25 26 23 26 23" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Our Values',
    desc: 'Integrity, honesty, transparency and commitment to delivering the best for our clients.',
  },
];

const statItems = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-9 sm:h-9">
        <rect x="5" y="18" width="7" height="13" rx="1" stroke={GOLD} strokeWidth="1.4" />
        <rect x="14.5" y="10" width="7" height="21" rx="1" stroke={GOLD} strokeWidth="1.4" />
        <rect x="24" y="14" width="7" height="17" rx="1" stroke={GOLD} strokeWidth="1.4" />
      </svg>
    ),
    value: '10+',
    label: 'Years of Experience',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-9 sm:h-9">
        <path d="M18 3 L31 9 L31 21 C31 27 25 32 18 34 C11 32 5 27 5 21 L5 9 Z" stroke={GOLD} strokeWidth="1.4" fill="none" />
        <path d="M12 18 L16 22 L24 14" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    value: '150+',
    label: 'Properties Sold',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-9 sm:h-9">
        <circle cx="18" cy="13" r="6.5" stroke={GOLD} strokeWidth="1.4" />
        <path d="M6 33 C6 26 11 21 18 21 C25 21 30 26 30 33" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    value: '250+',
    label: 'Happy Clients',
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="w-7 h-7 sm:w-9 sm:h-9">
        <path d="M18 4 C18 4 6 11 6 20 C6 26 11 31 18 31 C25 31 30 26 30 20 C30 11 18 4 18 4Z" stroke={GOLD} strokeWidth="1.4" fill="none" />
        <circle cx="18" cy="20" r="3" stroke={GOLD} strokeWidth="1.4" />
        <line x1="18" y1="17" x2="18" y2="11" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    value: '15+',
    label: 'Premium Locations',
  },
];

const MissionValues: React.FC = () => (
  <section className="py-12 sm:py-16 lg:py-20" style={{ background: 'var(--bg-secondary)' }}>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <h2
          className="text-reveal text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
          style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }}
        >
          Our Mission &amp; Values
        </h2>
        <div className="w-12 h-[3px] rounded mb-8 sm:mb-10 lg:mb-12" style={{ background: GOLD }} />
      </motion.div>

      {/* Two-column: left = 3 items, right = stats box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-start">
        {/* Left: Mission / Vision / Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
          {missionItems.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}
              className="flex"
            >
              <TiltCard
                style={{
                  padding: '1.5rem',
                  borderRadius: '0.875rem',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-card)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                maxTilt={10}
                scale={1.04}
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                  style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', flexShrink: 0 }}
                >
                  {item.icon}
                </motion.div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7, flex: 1 }}>{item.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Right: Stats — glassmorphic panel */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
          className="glass-gold dark:glass-navy"
          style={{ padding: '2.5rem 2rem' }}
        >
          <p style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '2rem', textAlign: 'center' }}>
            Our Track Record
          </p>
          <div className="grid grid-cols-2 gap-8">
            {statItems.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp} initial="hidden" whileInView="show" custom={i * 0.5} viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{ textAlign: 'center', cursor: 'default' }}
              >
                <p style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '2.25rem', color: GOLD, lineHeight: 1, marginBottom: '0.5rem' }}>
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-white/60" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── Meet Our Broker ───────────────────────────────────────────────────────────
const brokerSocials = [
  { label: 'Facebook', d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'LinkedIn', d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a6 6 0 0 1 2-2zM2 9h4v12H2zM4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z' },
  {
    label: 'Instagram',
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  },
];

const brokerChecklist = [
  '10+ Years of Industry Experience',
  'Expert in Residential & Commercial Properties',
  'Personalized Property Solutions',
  'Strong Network & Market Knowledge',
  'Transparent and Honest Deals',
];

const BrokerSocialBtn: React.FC<{ label: string; d: string }> = ({ label, d }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <motion.a
      href="#"
      aria-label={label}
      whileHover={{ scale: 1.15, rotateY: 15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      style={{
        width: '2.25rem', height: '2.25rem', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? GOLD : NAVY,
        color: hovered ? NAVY : '#fff',
        textDecoration: 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 4px 14px rgba(201,168,76,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'background 0.25s, box-shadow 0.25s, color 0.25s',
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
    </motion.a>
  );
};

const MeetBroker: React.FC = () => (
  <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-navy-900 transition-colors duration-300">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginBottom: '3rem' }}>
        <p style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '0.875rem' }}>
          Leadership
        </p>
        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold"
          style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)', marginBottom: '1rem' }}
        >
          Meet Our Broker
        </h2>
        <div className="gold-bar" aria-hidden="true" />
      </motion.div>

      <div className="lg:grid lg:grid-cols-3 rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.10)', border: '1px solid var(--border-light)' }}>
        {/* Col 1 — Photo */}
        <motion.div
          variants={fadeIn} initial="hidden" whileInView="show" custom={0} viewport={{ once: true }}
          className="relative lg:h-full overflow-hidden"
          style={{ background: '#e9ecf0', minHeight: '360px' }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&q=80"
            alt="Rohit Sharma — Founder & Real Estate Consultant"
            className="block w-full h-full object-cover object-top"
            style={{ minHeight: '360px', maxHeight: '480px' }}
            loading="lazy"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {/* Gradient overlay at bottom */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
              background: `linear-gradient(to top, ${NAVY}CC 0%, transparent 100%)`,
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* Col 2 — Bio */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}
          className="reveal-item p-6 sm:p-8 lg:p-10"
          style={{ borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}
        >
          <p className="text-reveal text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            MEET OUR BROKER
          </p>
          <h2
            className="text-reveal text-xl sm:text-2xl lg:text-3xl font-bold mb-1"
            style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }}
          >
            Rohit Sharma
          </h2>
          <p className="text-sm font-semibold mb-4 sm:mb-5" style={{ color: GOLD }}>
            Founder &amp; Real Estate Consultant
          </p>
          <p className="text-sm leading-relaxed mb-6 sm:mb-7" style={{ color: '#4b5563' }}>
            With over 10 years of experience in the real estate industry, Rohit Sharma
            has helped hundreds of clients buy, sell, and invest in properties with
            confidence. His market knowledge, negotiation skills, and dedication
            ensure the best results for every client.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {brokerSocials.map((s) => (
              <BrokerSocialBtn key={s.label} label={s.label} d={s.d} />
            ))}
          </div>
        </motion.div>

        {/* Col 3 — Checklist */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }}
          className="p-8 lg:p-10"
          style={{ background: 'var(--bg-secondary)', transition: 'background-color 0.3s' }}
        >
          <p style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '1.5rem' }}>
            Expertise
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {brokerChecklist.map((item, i) => (
              <motion.li
                key={item}
                variants={fadeUp} initial="hidden" whileInView="show" custom={i * 0.15} viewport={{ once: true }}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-start gap-3"
                style={{ cursor: 'default' }}
              >
                <motion.svg
                  width="20" height="20" viewBox="0 0 20 20" fill="none"
                  style={{ flexShrink: 0, marginTop: '0.125rem' }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <circle cx="10" cy="10" r="9" stroke={GOLD} strokeWidth="1.4" />
                  <path d="M6 10.5 L8.5 13 L14 7.5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, transition: 'color 0.3s' }}>
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─── Bottom CTA ────────────────────────────────────────────────────────────────
const AboutCTA: React.FC = () => (
  <section style={{ background: NAVY }} className="py-8 sm:py-10 lg:py-12">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="glass-navy relative overflow-hidden"
        style={{ padding: '2.5rem 2rem' }}
      >
        {/* Gold radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '-50px', left: '-50px',
            width: '250px', height: '250px',
            background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left flex-col sm:flex-row">
            <motion.div
              aria-hidden="true"
              whileHover={{ scale: 1.15, rotate: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              style={{ flexShrink: 0, width: '3.5rem', height: '3.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.12)', border: '1.5px solid rgba(201,168,76,0.35)', boxShadow: '0 0 16px rgba(201,168,76,0.2)' }}
            >
              <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
                <path d="M2 10 L6 7 L10 10 L13 8 L17 10 L21 7 L24 10" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 10 L2 15 C2 15 6 19 10 19 L16 19 L20 15" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 15 L24 11 L24 10" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </motion.div>
            <div>
              <h2 id="about-cta-heading" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff', fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', marginBottom: '0.25rem' }}>
                At New Star Real Estate, we don't just find properties,
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}>
                we build relationships that last a lifetime.
              </p>
            </div>
          </div>

          {/* Right */}
          <MagneticButton
            href="/contact"
            className="btn-gold flex-shrink-0"
            style={{ padding: '0.875rem 2.25rem', fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Get In Touch
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
import { useGsapScrollReveal, useGsapTextScroll, useGsapParallax } from '@/utils/animations';
import { useRef } from 'react';

const AboutPage: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  
  useGsapScrollReveal(mainRef);
  useGsapTextScroll(mainRef);
  useGsapParallax(mainRef);

  return (
    <main id="main-content" ref={mainRef}>
      <AboutHero />
      <WhoWeAre />
      <MissionValues />
      <MeetBroker />
      <AboutCTA />
    </main>
  );
};

export default AboutPage;