import React from 'react';

type ButtonVariant = 'gold' | 'navy' | 'outline-gold' | 'outline-white';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '0.5rem 1rem', fontSize: '0.8125rem' },
  md: { padding: '0.75rem 1.5rem', fontSize: '0.875rem' },
  lg: { padding: '1rem 2rem', fontSize: '1rem' },
};

const GOLD = '#C9A84C';
const NAVY = '#0B1120';

const baseStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  gap: '0.5rem', fontFamily: 'Inter, sans-serif', fontWeight: 600,
  borderRadius: '0.375rem', cursor: 'pointer', transition: 'all 0.3s', border: 'none',
  letterSpacing: '0.02em', textDecoration: 'none',
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  gold: { background: `linear-gradient(135deg, ${GOLD}, #E6C97A)`, color: NAVY, border: `1px solid ${GOLD}` },
  navy: { background: NAVY, color: '#fff', border: '1px solid rgba(255,255,255,0.2)' },
  'outline-gold': { background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` },
  'outline-white': { background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' },
};

export const Button = React.memo<ButtonProps>(
  ({ variant = 'gold', size = 'md', children, onClick, className, style, disabled, type = 'button', leftIcon, rightIcon, ...rest }) => {
    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...(disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
      ...style,
    };

    return (
      <button
        type={type}
        className={className}
        style={combinedStyle}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
