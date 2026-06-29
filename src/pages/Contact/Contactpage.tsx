import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from 'framer-motion';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E6C97A';
const NAVY = '#0B1120';

/* ─── Reduced-motion hook ──────────────────────────────────────────────────── */
const useReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
};

/* ─── 3D Tilt Card — mouse-follow perspective tilt + glare ─────────────────── */
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
}> = ({ children, className, style, maxTilt = 6, scale = 1.015, glare = false }) => {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [rx, setRx] = React.useState(0);
  const [ry, setRy] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
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
      style={{ ...style, transformStyle: reduced ? 'flat' : 'preserve-3d', willChange: reduced ? 'auto' : 'transform' }}
      animate={reduced ? {} : { rotateX: rx, rotateY: ry, scale: hovered ? scale : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !reduced && setHovered(true)}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && !reduced && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
            opacity: hovered ? 0.5 : 0, transition: 'opacity 0.3s',
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
  type?: 'submit' | 'button';
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  strength?: number;
}> = ({ children, type, href, className, style, disabled, strength = 0.2 }) => {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<any>) => {
    if (disabled || reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setOffset({ x, y });
  };

  const sharedProps = {
    ref: ref as any,
    className,
    style,
    animate: reduced ? {} : { x: offset.x, y: offset.y },
    whileHover: (disabled || reduced) ? {} : { scale: 1.04 },
    whileTap: (disabled || reduced) ? {} : { scale: 0.97 },
    transition: { type: 'spring', stiffness: 300, damping: 20 } as any,
    onMouseMove: handleMouseMove,
    onMouseLeave: () => setOffset({ x: 0, y: 0 }),
  };

  if (href) {
    return <motion.a href={href} {...sharedProps}>{children}</motion.a>;
  }
  return (
    <motion.button type={type} disabled={disabled} {...sharedProps}>
      {children}
    </motion.button>
  );
};

const MailIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="5.5" width="19" height="13" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M3.5 7 L12 13.2 L20.5 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6.7 3.5h3l1.4 3.8-2 1.6a11.5 11.5 0 0 0 5.4 5.4l1.6-2 3.8 1.4v3c0 1.1-.9 2-2 2-7 0-13-6-13-13 0-1.1.9-2 2-2z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const MapPinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 21s7-7.4 7-12.2A7 7 0 1 0 5 8.8C5 13.6 12 21 12 21z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <circle cx="12" cy="8.8" r="2.6" stroke={color} strokeWidth="1.4" />
  </svg>
);

const ClockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = GOLD }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.4" />
    <path d="M12 7.5v4.7l3.3 1.9" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = 'var(--text-secondary)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.3" stroke={color} strokeWidth="1.5" />
    <path d="M5 20c0-3.6 3.1-6.3 7-6.3s7 2.7 7 6.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PencilIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = 'var(--text-secondary)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20l1-4.2L15.6 5.3a1.5 1.5 0 0 1 2.1 0l1.1 1.1a1.5 1.5 0 0 1 0 2.1L8.2 19 4 20z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDownIcon: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = 'var(--text-secondary)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 8.5 12 15 19 8.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 13, color = 'var(--text-secondary)' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10.5" width="14" height="9" rx="1.5" stroke={color} strokeWidth="1.4" />
    <path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" stroke={color} strokeWidth="1.4" />
  </svg>
);

const HeadsetIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 13a8 8 0 1 1 16 0" stroke={GOLD} strokeWidth="1.4" />
    <rect x="3" y="13" width="4" height="6" rx="1.4" stroke={GOLD} strokeWidth="1.4" />
    <rect x="17" y="13" width="4" height="6" rx="1.4" stroke={GOLD} strokeWidth="1.4" />
    <path d="M7 19.5v.5a3 3 0 0 0 3 3h2" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const BuildingsIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="9.5" width="7" height="11.5" stroke={GOLD} strokeWidth="1.4" />
    <rect x="13" y="4" width="8" height="17" stroke={GOLD} strokeWidth="1.4" />
    <path d="M5.5 12.5h2M5.5 15.5h2M5.5 18.5h2M15.5 7.5h3M15.5 10.5h3M15.5 13.5h3M15.5 16.5h3" stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const HandshakeIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
    <path d="M2 10 L6 7 L10 10 L13 8 L17 10 L21 7 L24 10" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 10 L2 15 C2 15 6 19 10 19 L16 19 L20 15" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 15 L24 11 L24 10" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M10 19 L9 23 M14 19 L14 23 M18 19 L19 23" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const HouseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 11.5 12 4 20 11.5" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M10 20v-5h4v5" stroke={GOLD} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/* ─── Hero ──────────────────────────────────────────────────────────────────── */
const ContactHero: React.FC = () => (
  <section className="relative overflow-hidden flex items-center" style={{ minHeight: '320px' }} aria-labelledby="contact-hero-heading">
    <motion.img
      src="https://images.unsplash.com/photo-1623298317883-6b70254edf31?w=1600&q=80"
      alt="Modern home exterior lit up at night"
      className="absolute inset-0 w-full h-full object-cover"
      initial={{ scale: 1.15 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    />
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(rgba(11,17,32,0.55), rgba(11,17,32,0.82))' }}
    />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-2 lg:pt-28 lg:pb-6 w-full">
      <h1
        id="contact-hero-heading"
        className="text-5xl sm:text-6xl font-bold text-white"
        style={{ fontFamily: '"Playfair Display", serif' }}
      >
        Contact Us
      </h1>
      <div className="flex items-center gap-2 mt-3 text-xs font-semibold tracking-wider text-gray-300 font-inter uppercase">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" style={{ color: GOLD }} />
        <span className="text-white">Contact</span>
      </div>
      <div className="mt-4 w-16 h-[3px] rounded" style={{ background: GOLD }} />
      <p className="mt-5 text-base sm:text-lg max-w-md leading-relaxed" style={{ color: '#d1d5db' }}>
        We're here to help you find the perfect property. Get in touch with us today!
      </p>
    </div>
  </section>
);

/* ─── Send Us a Message ─────────────────────────────────────────────────────── */
const SendMessageForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', interest: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (values: typeof form) => {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = 'Name is required.';
    if (!values.phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(values.phone.trim())) errs.phone = 'Enter a valid phone number.';
    if (!values.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Enter a valid email address.';
    if (!values.message.trim()) errs.message = 'Message is required.';
    else if (values.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched[e.target.name]) {
      setFieldErrors(validate(updated));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setFieldErrors(validate({ ...form, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to send message.');

      setStatus('success');
      setForm({ name: '', phone: '', email: '', interest: '', message: '' });
      setTouched({});
      setFieldErrors({});
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  const getFieldStyle = (name: string): React.CSSProperties => ({
    borderColor: fieldErrors[name] && touched[name] ? '#ef4444' : touched[name] && !fieldErrors[name] ? '#10b981' : 'var(--border-color)',
    color: 'var(--text-primary)',
    background: 'var(--bg-card, white)',
    transition: 'border-color 0.2s',
  });

  const fieldClass = 'w-full rounded-lg border text-sm py-3 pl-10 pr-4 focus:outline-none placeholder:text-gray-400';

  const FieldError = ({ name }: { name: string }) =>
    touched[name] && fieldErrors[name] ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 mt-1 ml-1 font-medium"
      >
        {fieldErrors[name]}
      </motion.p>
    ) : null;

  return (
    <div className="form-glass p-6 sm:p-8 h-full">
      <div className="flex items-center gap-2 mb-2">
        <MailIcon size={20} color={GOLD} />
        <h2 className="text-reveal text-2xl sm:text-[1.65rem] font-bold" style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }}>
          Send Us a Message
        </h2>
      </div>
      <p className="text-reveal text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        Have a question or looking for property? Fill out the form and we'll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2"><UserIcon /></span>
              <input type="text" name="name" placeholder="Your Name *"
                value={form.name} onChange={handleChange} onBlur={handleBlur}
                className={fieldClass} style={getFieldStyle('name')} />
            </div>
            <FieldError name="name" />
          </div>
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2"><PhoneIcon size={18} color="#9ca3af" /></span>
              <input type="tel" name="phone" placeholder="Your Phone Number *"
                value={form.phone} onChange={handleChange} onBlur={handleBlur}
                className={fieldClass} style={getFieldStyle('phone')} />
            </div>
            <FieldError name="phone" />
          </div>
        </div>

        <div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2"><MailIcon size={18} color="#9ca3af" /></span>
            <input type="email" name="email" placeholder="Your Email *"
              value={form.email} onChange={handleChange} onBlur={handleBlur}
              className={fieldClass} style={getFieldStyle('email')} />
          </div>
          <FieldError name="email" />
        </div>

        <div className="relative">
          <select name="interest" value={form.interest} onChange={handleChange} onBlur={handleBlur}
            className="w-full rounded-lg border text-sm py-3 pl-4 pr-10 focus:outline-none appearance-none"
            style={{ borderColor: 'var(--border-color)', color: form.interest ? 'var(--text-primary)' : 'var(--text-secondary)', background: 'var(--bg-card, white)', transition: 'border-color 0.2s' }}>
            <option value="">I'm Interested In</option>
            <option value="buying">Buying a Property</option>
            <option value="renting">Renting / Lease</option>
            <option value="selling">Selling a Property</option>
            <option value="investment">Investment Consultation</option>
            <option value="other">Other</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDownIcon /></span>
        </div>

        <div>
          <div className="relative">
            <span className="absolute left-3.5 top-3.5"><PencilIcon /></span>
            <textarea name="message" placeholder="Your Message *" rows={4}
              value={form.message} onChange={handleChange} onBlur={handleBlur}
              className={`${fieldClass} resize-none`}
              style={{ ...getFieldStyle('message'), minHeight: '112px' }} />
          </div>
          <FieldError name="message" />
        </div>

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg px-4 py-3 text-sm font-semibold text-red-700 border border-red-200"
            style={{ background: '#fef2f2' }}
          >
            ⚠️ {errorMsg}
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg px-4 py-3 text-sm font-semibold text-emerald-700 border border-emerald-200"
            style={{ background: '#ecfdf5' }}
          >
            ✅ Your message has been sent! We'll get back to you shortly.
          </motion.div>
        )}

        <MagneticButton
          type="submit"
          disabled={status === 'sending' || status === 'success'}
          className="w-full flex items-center justify-center gap-2 rounded py-3.5 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: NAVY, color: GOLD }}
        >
          {status === 'sending' ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={GOLD} strokeWidth="2" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
              </svg>
              SENDING…
            </>
          ) : status === 'success' ? (
            'MESSAGE SENT ✓'
          ) : (
            <>SEND MESSAGE &nbsp;→</>
          )}
        </MagneticButton>

        <p className="flex items-center justify-center gap-1.5 text-xs pt-1" style={{ color: 'var(--text-secondary)' }}>
          <LockIcon />
          Your information is safe with us. We don't share your details.
        </p>
      </form>
    </div>
  );
};

/* ─── Our Contact Information ───────────────────────────────────────────────── */
const infoItems: { icon: React.ReactNode; label: string; lines: string[]; boldFirstLine?: boolean }[] = [
  {
    icon: <MapPinIcon />,
    label: 'Office Address',
    boldFirstLine: true,
    lines: ['New Star Real Estate', 'Hiranandani Fortune City,', 'Panvel, Navi Mumbai'],
  },
  {
    icon: <PhoneIcon />,
    label: 'Phone Number',
    lines: ['+91 76203 33467'],
  },
  {
    icon: <MailIcon />,
    label: 'Email Address',
    lines: ['info@newstarrealestate.com', 'support@newstarrealestate.com'],
  },
  {
    icon: <ClockIcon />,
    label: 'Business Hours',
    lines: ['Monday - Saturday: 10:00 AM – 7:00 PM', 'Sunday: By Appointment'],
  },
];

const socials = [
  { label: 'Facebook', d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  {
    label: 'Instagram',
    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  },
  {
    label: 'LinkedIn',
    d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a6 6 0 0 1 2-2zM2 9h4v12H2zM4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  },
  {
    label: 'WhatsApp',
    d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-1.746-.872-2.892-1.557-4.046-3.532-.305-.524.305-.486.873-1.617.097-.198.05-.371-.05-.52-.099-.149-.669-1.611-.916-2.207-.241-.579-.487-.5-.668-.51-.173-.01-.371-.012-.57-.012-.197 0-.519.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.148.198 2.041 3.111 4.945 4.237 2.904 1.126 2.904.751 3.424.703.52-.05 1.69-.692 1.93-1.36.24-.67.24-1.24.166-1.36-.074-.119-.272-.198-.57-.347zM12.04 22h-.01a9.94 9.94 0 0 1-5.07-1.39l-.36-.21-3.77.99 1.01-3.68-.24-.38A9.96 9.96 0 0 1 2 11.99C2 6.49 6.5 2 12.01 2 14.68 2 17.18 3.05 19.05 4.93A9.92 9.92 0 0 1 22 11.99c0 5.5-4.5 10-10 10z',
  },
];

/* ─── Contact Social Button ──────────────────────────────────────────────────── */
const ContactSocialBtn: React.FC<{ label: string; d: string }> = ({ label, d }) => {
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
        background: hovered ? GOLD : 'rgba(255,255,255,0.12)',
        border: `1px solid ${hovered ? GOLD : 'rgba(255,255,255,0.25)'}`,
        color: hovered ? NAVY : '#fff',
        textDecoration: 'none',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 4px 14px rgba(201,168,76,0.35)' : 'none',
        transition: 'background 0.25s, box-shadow 0.25s, color 0.25s, border-color 0.25s',
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={d} /></svg>
    </motion.a>
  );
};

const ContactInfo: React.FC = () => (
  <div className="reveal-item rounded-2xl border p-8 h-full bg-white dark:bg-navy-900 shadow-[0_2px_20px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1.5 hover:border-[#C9A84C]/40 transition-all duration-500 group" style={{ borderColor: 'var(--border-color)' }}>
    <h2 className="text-reveal text-2xl sm:text-[1.65rem] font-bold mb-6 group-hover:text-[#C9A84C] transition-colors duration-300" style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }}>
      Our Contact Information
    </h2>
    <div className="flex flex-col xl:grid xl:grid-cols-2 gap-8">
      <div className="space-y-6">
        {infoItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ x: 4 }}
            className="flex items-start gap-4"
            style={{ cursor: 'default' }}
          >
            <motion.div
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1.5px solid rgba(201,168,76,0.3)', boxShadow: '0 0 12px rgba(201,168,76,0.15)' }}
              whileHover={{ scale: 1.15, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              aria-hidden="true"
            >
              {item.icon}
            </motion.div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: GOLD }}>{item.label}</p>
              {item.lines.map((line, i) => {
                const isPhone = item.label === 'Phone Number';
                const isEmail = item.label === 'Email Address';
                const href = isPhone ? `tel:${line.replace(/\s+/g, '')}` : isEmail ? `mailto:${line}` : undefined;
                const styling = { color: i === 0 && item.boldFirstLine ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: i === 0 && item.boldFirstLine ? 700 : 400 };

                return (
                  <p key={i} className="text-sm leading-relaxed">
                    {href ? (
                      <a href={href} className="hover:text-[#C9A84C] transition-colors duration-300" style={styling}>
                        {line}
                      </a>
                    ) : (
                      <span style={styling}>{line}</span>
                    )}
                  </p>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden border flex flex-col" style={{ borderColor: 'var(--border-color)', minHeight: '320px' }}>
        <div className="relative flex-1" style={{ minHeight: '170px' }}>
          <iframe
            title="New Star Real Estate location"
            src="https://www.google.com/maps?q=Hiranandani+Fortune+City,+Panvel,+Navi+Mumbai&output=embed"
            width="100%" height="100%"
            className="absolute inset-0 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute flex items-center gap-1.5 px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -100%)', background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M12 22s7.5-7.6 7.5-13a7.5 7.5 0 1 0-15 0c0 5.4 7.5 13 7.5 13z" />
              <circle cx="12" cy="9" r="2.6" fill="#fff" />
            </svg>
            <span className="text-xs font-semibold" style={{ color: '#111827' }}>New Star Real Estate</span>
          </div>
        </div>

        <div className="py-4 text-center" style={{ background: NAVY }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Connect With Us</p>
          <div className="flex justify-center gap-2.5">
            {socials.map((s) => (
              <ContactSocialBtn key={s.label} label={s.label} d={s.d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Form + Info section wrapper ───────────────────────────────────────────── */
const ContactFormSection: React.FC = () => (
  <section className="pt-4 pb-16 lg:pt-6 lg:pb-20 bg-white dark:bg-navy-900 transition-colors duration-300">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-10 items-stretch">
        <div className="w-full"><SendMessageForm /></div>
        <div className="w-full"><ContactInfo /></div>
      </div>
    </div>
  </section>
);

/* ─── Feature strip ──────────────────────────────────────────────────────────── */
const features = [
  { icon: <HeadsetIcon />, title: 'Quick Response', desc: 'We respond quickly to all your queries.' },
  { icon: <BuildingsIcon />, title: 'Expert Guidance', desc: 'Get professional advice from real estate experts.' },
  { icon: <HandshakeIcon />, title: 'Trusted Services', desc: 'Transparent deals and honest support.' },
  { icon: <HouseIcon />, title: 'Best Properties', desc: 'Find the perfect property that fits your needs.' },
];

const FeatureStrip: React.FC = () => (
  <section className="pb-16 lg:pb-20 bg-white dark:bg-navy-900 transition-colors duration-300">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className="rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8 lg:p-10"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <TiltCard
              className="flex items-start gap-4"
              style={{ cursor: 'default', padding: '0.25rem' }}
              maxTilt={8}
              scale={1.03}
            >
              <motion.div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1.5px solid rgba(201,168,76,0.25)', boxShadow: '0 0 10px rgba(201,168,76,0.1)' }}
                whileHover={{ rotate: 10, scale: 1.12 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                aria-hidden="true"
              >
                {f.icon}
              </motion.div>
              <div>
                <p className="text-base font-bold mb-1" style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-primary)' }}>{f.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

import { useGsapScrollReveal, useGsapTextScroll, useGsapParallax } from '@/utils/animations';
import { useRef } from 'react';

/* ─── Page ───────────────────────────────────────────────────────────────────── */
const ContactPage: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);
  
  useGsapScrollReveal(mainRef);
  useGsapTextScroll(mainRef);
  useGsapParallax(mainRef);

  return (
    <main id="main-content" ref={mainRef}>
      <ContactHero />
      <ContactFormSection />
      <FeatureStrip />
    </main>
  );
};

export default ContactPage;