import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Code2, Cpu, Layers, Palette, Sparkles, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DEV_FLOATERS = [
  { id: 'code', label: '</>', icon: Code2, pos: 'pos-tl', depth: 18, mobileHide: false },
  { id: 'react', label: '{ React }', icon: Terminal, pos: 'pos-tr', depth: -22, mobileHide: false },
  { id: 'mobile', label: 'React Native', icon: Cpu, pos: 'pos-bl', depth: 14, mobileHide: true },
  { id: 'stack', label: 'C# • Python', icon: Layers, pos: 'pos-br', depth: -16, mobileHide: false },
];

const DESIGN_FLOATERS = [
  { id: 'ui', label: '✦ UI/UX', icon: Sparkles, pos: 'pos-tl', depth: 18, mobileHide: false },
  { id: 'figma', label: 'Figma', icon: Layers, pos: 'pos-tr', depth: -22, mobileHide: false },
  { id: 'brand', label: 'Brand & Art', icon: Palette, pos: 'pos-bl', depth: 14, mobileHide: true },
  { id: 'sbc', label: 'SBC 2025', icon: Sparkles, pos: 'pos-br', depth: -16, mobileHide: false },
];

export default function HeroFloatingField({ sectionRef }) {
  const { mode } = useApp();
  const fieldRef = useRef(null);
  const items = mode === 'dev' ? DEV_FLOATERS : DESIGN_FLOATERS;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const field = fieldRef.current;
    const section = sectionRef?.current;
    if (!field) return;

    const ctx = gsap.context(() => {
      const floaters = gsap.utils.toArray('.hero-floater');
      floaters.forEach((el, idx) => {
        gsap.to(el, {
          y: idx % 2 === 0 ? -12 : 12,
          x: idx % 2 === 0 ? 6 : -6,
          rotation: idx % 2 === 0 ? 3 : -3,
          duration: 3 + idx * 0.55,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      const orbs = gsap.utils.toArray('.hero-ambient-orb');
      orbs.forEach((orb, idx) => {
        gsap.to(orb, {
          scale: 1.12,
          x: idx % 2 === 0 ? 18 : -18,
          y: idx % 2 === 0 ? -14 : 14,
          duration: 5.5 + idx * 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, fieldRef);

    // Subtle pointer parallax on fine-pointer devices
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: fine)').matches;

    let cleanupMouse = null;
    if (isFinePointer && section) {
      const floaters = Array.from(field.querySelectorAll('.hero-floater'));
      const quickSetters = floaters.map((el) => ({
        xTo: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power2.out' }),
        yTo: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power2.out' }),
        depth: Number(el.dataset.depth || 16),
      }));

      const onMove = (e) => {
        const rect = section.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        quickSetters.forEach(({ xTo, yTo, depth }) => {
          xTo(nx * depth);
          yTo(ny * depth);
        });
      };

      const onLeave = () => {
        quickSetters.forEach(({ xTo, yTo }) => {
          xTo(0);
          yTo(0);
        });
      };

      section.addEventListener('mousemove', onMove);
      section.addEventListener('mouseleave', onLeave);
      cleanupMouse = () => {
        section.removeEventListener('mousemove', onMove);
        section.removeEventListener('mouseleave', onLeave);
      };
    }

    return () => {
      if (cleanupMouse) cleanupMouse();
      ctx.revert();
    };
  }, [mode, sectionRef]);

  const handlePop = (e) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const target = e.currentTarget;
    gsap.fromTo(
      target,
      { scale: 1.26, rotation: -10 },
      { scale: 1, rotation: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' }
    );
  };

  return (
    <div ref={fieldRef} className="hero-floating-field" aria-hidden="true">
      <span className="hero-ambient-orb orb-1" />
      <span className="hero-ambient-orb orb-2" />

      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            tabIndex={-1}
            data-depth={item.depth}
            className={`hero-floater ${item.pos} ${item.mobileHide ? 'hide-on-mobile' : ''}`}
            onClick={handlePop}
            data-no-spray="true"
          >
            <Icon size={14} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
