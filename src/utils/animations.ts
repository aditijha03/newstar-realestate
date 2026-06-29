import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register plugins once
gsap.registerPlugin(ScrollTrigger);

// Helper to check for user reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * A custom hook to fade in elements as they scroll into view.
 * @param scopeRef - React ref to the parent container
 * @param selector - String selector of elements to animate (e.g. '.reveal-item')
 */
export const useGsapScrollReveal = (scopeRef: React.RefObject<HTMLDivElement | HTMLElement | null>, selector: string = '.reveal-item') => {
  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(selector, { opacity: 1, y: 0 });
      return;
    }

    const elements = gsap.utils.toArray(selector) as HTMLElement[];
    
    if (elements.length === 0) return;

    elements.forEach((element) => {
      gsap.fromTo(element, 
        { opacity: 0, y: 40 }, 
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, { scope: scopeRef });
};

/**
 * A custom hook to fade and slide up text elements as they scroll into view.
 * Excellent for headings and prominent text.
 * @param scopeRef - React ref to the parent container
 * @param selector - String selector of elements to animate (e.g. '.text-reveal')
 */
export const useGsapTextScroll = (scopeRef: React.RefObject<HTMLDivElement | HTMLElement | null>, selector: string = '.text-reveal') => {
  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(selector, { opacity: 1, y: 0 });
      return;
    }

    const elements = gsap.utils.toArray(selector) as HTMLElement[];
    
    if (elements.length === 0) return;

    elements.forEach((element) => {
      // Setup initial state: make sure element starts invisible and pushed down
      gsap.set(element, { opacity: 0, y: 30 });
      
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%', // Start animation when top of element hits 90% down the viewport
          toggleActions: 'play none none reverse', // Plays on enter, reverses on leave
        }
      });
    });
  }, { scope: scopeRef });
};

/**
 * A custom hook to create a subtle parallax effect on images or backgrounds.
 * @param scopeRef - React ref to the parent container
 * @param selector - String selector of elements to animate (e.g. '.parallax-img')
 * @param speed - The speed of the parallax. Positive moves it down, negative moves it up.
 */
export const useGsapParallax = (scopeRef: React.RefObject<HTMLDivElement | HTMLElement | null>, selector: string = '.parallax-img', speed: number = 20) => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const elements = gsap.utils.toArray(selector) as HTMLElement[];
    if (elements.length === 0) return;

    elements.forEach((element) => {
      // It's usually best to make the image slightly larger than its container
      // and translate it across the container's height on scroll.
      gsap.fromTo(element,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: element.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });
  }, { scope: scopeRef });
};

/**
 * A custom hook to stagger the reveal of child elements (like property cards).
 * @param scopeRef - React ref to the parent container
 * @param containerSelector - Selector for the wrapper (e.g. '.stagger-container')
 * @param itemSelector - Selector for the children (e.g. '.stagger-item')
 */
export const useGsapStaggerReveal = (
  scopeRef: React.RefObject<HTMLDivElement | HTMLElement | null>, 
  containerSelector: string = '.stagger-container',
  itemSelector: string = '.stagger-item'
) => {
  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(itemSelector, { opacity: 1, y: 0 });
      return;
    }

    const containers = gsap.utils.toArray(containerSelector) as HTMLElement[];
    if (containers.length === 0) return;

    containers.forEach((container) => {
      const items = container.querySelectorAll(itemSelector);
      if (items.length === 0) return;

      // Set initial state
      gsap.set(items, { opacity: 0, y: 50 });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  }, { scope: scopeRef });
};

/**
 * A custom hook to animate a Hero section sequence on mount.
 */
export const useGsapHeroTimeline = (scopeRef: React.RefObject<HTMLDivElement | HTMLElement | null>) => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const hasPreloaderRun = sessionStorage.getItem('preloader_done');
    const initialDelay = hasPreloaderRun ? 0.2 : 2.0; // Wait for preloader on first visit, or 0.2s to prevent skipping
    if (!hasPreloaderRun) {
      sessionStorage.setItem('preloader_done', 'true');
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: initialDelay });

    // Initial state setup for hero elements
    gsap.set('.hero-bg', { scale: 1.1, opacity: 0 });
    gsap.set('.hero-anim', { y: 30, opacity: 0 });
    gsap.set('.hero-letter', { opacity: 0 });
    gsap.set('.hero-word', { opacity: 0 });

    tl.to('.hero-bg', {
      scale: 1,
      opacity: 1,
      duration: 1.0,
    })
    .fromTo('.hero-letter', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.015, ease: "power3.out" }, 
      '-=0.6'
    )
    .fromTo('.hero-heading-word .hero-word', 
      { y: 15, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, stagger: 0.15, ease: "power2.out" }, 
      '-=0.2'
    )
    .fromTo('.hero-subtitle-word .hero-word', 
      { y: 15, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.4, stagger: 0.02, ease: "power2.out" }, 
      '-=0.4'
    )
    .to('.hero-anim', {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
    }, '-=0.2'); 
  }, { scope: scopeRef });
};

/**
 * A custom hook to add magnetic hover effects to elements.
 */
export const useGsapMagneticHover = (scopeRef: React.RefObject<HTMLDivElement | HTMLElement | null>, selector: string = '.magnetic-btn') => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const elements = gsap.utils.toArray(selector) as HTMLElement[];
    if (elements.length === 0) return;

    elements.forEach((element) => {
      // Find internal text or icon to move slightly more than the container
      const content = element.querySelector('.magnetic-content');

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          duration: 0.4,
          ease: 'power2.out',
        });

        if (content) {
          gsap.to(content, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.3)',
        });

        if (content) {
          gsap.to(content, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)',
          });
        }
      });
    });
  }, { scope: scopeRef });
};

/**
 * A custom hook to add subtle image scaling on hover.
 */
export const useGsapImageScale = (scopeRef: React.RefObject<HTMLDivElement | HTMLElement | null>, selector: string = '.hover-scale-container') => {
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const containers = gsap.utils.toArray(selector) as HTMLElement[];
    if (containers.length === 0) return;

    containers.forEach((container) => {
      const img = container.querySelector('img');
      if (!img) return;

      container.addEventListener('mouseenter', () => {
        gsap.to(img, {
          scale: 1.05,
          duration: 0.6,
          ease: 'power3.out',
        });
      });

      container.addEventListener('mouseleave', () => {
        gsap.to(img, {
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
        });
      });
    });
  }, { scope: scopeRef });
};
