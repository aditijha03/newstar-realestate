import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, Mail, MapPin } from 'lucide-react';
import { QUICK_LINKS, PROPERTY_LINKS, EMAIL, PHONE_NUMBER, PHONE_HREF, COMPANY_ADDRESS } from '@/utils/constants';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E6C97A';
const NAVY = '#0B1120';

// Inline SVG social icons to avoid lucide-react version issues
const SocialFacebook = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const SocialInstagram = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const SocialTwitter = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
const SocialLinkedin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const SocialYoutube = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const socialLinks = [
  { key: 'facebook', href: 'https://facebook.com', label: 'Facebook', Icon: SocialFacebook },
  { key: 'instagram', href: 'https://instagram.com', label: 'Instagram', Icon: SocialInstagram },
  { key: 'twitter', href: 'https://twitter.com', label: 'Twitter', Icon: SocialTwitter },
  { key: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn', Icon: SocialLinkedin },
  { key: 'youtube', href: 'https://youtube.com', label: 'YouTube', Icon: SocialYoutube },
];

const FooterLink = ({ href, label }: { href: string; label: string }) => {
  const isExternal = href.startsWith('http');
  const style = { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' };
  const hoverEnter = (e: React.MouseEvent) => { (e.target as HTMLElement).style.color = GOLD; };
  const hoverLeave = (e: React.MouseEvent) => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; };

  return (
    <li>
      {isExternal ? (
        <a href={href} style={style} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>{label}</a>
      ) : (
        <Link to={href} style={style} onMouseEnter={hoverEnter} onMouseLeave={hoverLeave}>{label}</Link>
      )}
    </li>
  );
};

const FooterHeading = ({ title }: { title: string }) => (
  <h3 style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', transition: 'color 0.3s' }}>
    {title}
  </h3>
);

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', transition: 'background-color 0.3s, border-color 0.3s' }} role="contentinfo" aria-label="Site footer">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 lg:pt-12" style={{ paddingBottom: '2.5rem' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <Star className="w-8 h-8" style={{ color: GOLD, fill: GOLD, filter: 'drop-shadow(0 0 5px rgba(201, 168, 76, 0.45))' }} aria-hidden="true" />
              <div className="flex flex-col leading-none">
                <span style={{ color: 'var(--text-primary)', fontFamily: '"Playfair Display", serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', transition: 'color 0.3s' }}>NEW STAR</span>
                <span style={{ color: GOLD_LIGHT, fontFamily: 'Inter, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Real Estate</span>
              </div>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', transition: 'color 0.3s' }}>
              Your trusted partner in finding premium residential and commercial properties. 10+ years of excellence.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ key, href, label, Icon }) => (
                <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit our ${label} page`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s', boxShadow: 'var(--shadow-card)' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = GOLD; el.style.borderColor = GOLD; el.style.color = NAVY; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--bg-card)'; el.style.borderColor = 'var(--border-color)'; el.style.color = 'var(--text-secondary)'; el.style.transform = 'translateY(0)'; }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <FooterHeading title="Quick Links" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {QUICK_LINKS.map((link) => <FooterLink key={link.href} {...link} />)}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <FooterHeading title="Properties" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {PROPERTY_LINKS.map((link) => <FooterLink key={link.href} {...link} />)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <FooterHeading title="Contact Us" />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li>
                <a href={PHONE_HREF} className="flex items-start gap-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                  aria-label={`Call us: ${PHONE_NUMBER}`}
                >
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} aria-hidden="true" />
                  {PHONE_NUMBER}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-start gap-3"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} aria-hidden="true" />
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD }} aria-hidden="true" />
                <address style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'normal', transition: 'color 0.3s' }}>{COMPANY_ADDRESS}</address>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border-color)', transition: 'border-color 0.3s' }}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--text-secondary)', transition: 'color 0.3s' }}>
              © {year} New Star Real Estate. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }].map(({ label, href }, i, arr) => (
                <React.Fragment key={href}>
                  <Link to={href} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = GOLD; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'var(--text-secondary)'; }}
                  >{label}</Link>
                  {i < arr.length - 1 && <span style={{ color: 'var(--border-color)', transition: 'color 0.3s' }} aria-hidden="true">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
