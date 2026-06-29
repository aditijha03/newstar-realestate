import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GOLD = '#C9A84C';

export interface DropdownProps {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  variant?: 'searchbar' | 'filter';
}

export const Dropdown = React.memo<DropdownProps>(({ 
  id, 
  label, 
  icon, 
  value, 
  options, 
  onChange,
  variant = 'searchbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Set up the GSAP timeline once
  useGSAP(() => {
    if (!menuRef.current) return;

    const tl = gsap.timeline({ 
      paused: true,
      onReverseComplete: () => {
        if (menuRef.current) menuRef.current.style.display = 'none';
      }
    });

    // Smooth fade and slide down
    tl.set(menuRef.current, { display: 'block' })
      .fromTo(menuRef.current, 
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );

    tlRef.current = tl;
  }, { scope: containerRef }); // Run once

  // Play/Reverse based on state
  useEffect(() => {
    if (isOpen) {
      tlRef.current?.play();
    } else {
      tlRef.current?.reverse();
    }
  }, [isOpen]);

  // Handle hover interactions
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const isFilter = variant === 'filter';

  return (
    <div 
      ref={containerRef} 
      style={{ flex: 1, minWidth: 0, position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label && (
        <label
          htmlFor={id}
          className={isFilter 
            ? "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter dark:text-navy-200 transition-colors duration-300"
            : "block text-[0.7rem] font-semibold text-gray-500 uppercase tracking-[0.08em] mb-[2px] pl-1 font-inter transition-colors duration-300"
          }
        >
          {label}
        </label>
      )}
      
      <div 
        className={`relative flex items-center cursor-pointer transition-colors duration-300 ${
          isFilter 
            ? 'w-full bg-white border border-gray-200 rounded-lg dark:bg-navy-900 dark:border-navy-700' 
            : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon && (
          <span className="absolute left-3 pointer-events-none" style={{ color: GOLD }} aria-hidden="true">
            {icon}
          </span>
        )}
        <div
          id={id}
          className={`w-full border-none outline-none py-2.5 pr-8 text-sm font-inter text-gray-800 dark:text-gray-100 select-none whitespace-nowrap overflow-hidden overflow-ellipsis ${
            icon ? 'pl-8' : 'pl-3'
          } ${isFilter ? 'font-normal bg-transparent' : 'font-medium bg-transparent'}`}
        >
          {value}
        </div>
        <ChevronDown 
          className="absolute right-2 w-4 h-4 pointer-events-none transition-transform duration-300" 
          style={{ color: '#9ca3af', transform: isOpen ? 'rotate(180deg)' : 'none' }} 
          aria-hidden="true" 
        />
      </div>

      {/* Dropdown Menu */}
      <div
        ref={menuRef}
        className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-[#1e293b] rounded-xl shadow-xl overflow-hidden"
        style={{ display: 'none', minWidth: '100%' }}
        role="listbox"
      >
        <div className="py-2">
          {options.map((opt) => (
            <div
              key={opt}
              role="option"
              aria-selected={value === opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`dropdown-option px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-200 whitespace-nowrap overflow-hidden overflow-ellipsis ${
                value === opt 
                  ? 'bg-gray-50 dark:bg-[#1e293b] text-navy-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e293b] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
Dropdown.displayName = 'Dropdown';
