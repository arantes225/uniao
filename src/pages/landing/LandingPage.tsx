import React, { useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { HeroSection } from '../../components/landing/HeroSection';
import { AboutSection } from '../../components/landing/AboutSection';
import { LegalComplianceSection } from '../../components/landing/LegalComplianceSection';
import { CoursesSection } from '../../components/landing/CoursesSection';
import { TrainingGallerySection } from '../../components/landing/TrainingGallerySection';
import { AudienceSection } from '../../components/landing/AudienceSection';
import { MethodologySection } from '../../components/landing/MethodologySection';
import { InstructorsSection } from '../../components/landing/InstructorsSection';
import { FaqSection } from '../../components/landing/FaqSection';
import { ContactSection } from '../../components/landing/ContactSection';
import { FloatingWhatsAppButton } from '../../components/landing/FloatingWhatsAppButton';
import { Footer } from '../../components/layout/Footer';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    revealElements.forEach((element) => {
      const delay = element.getAttribute('data-reveal-delay');
      if (delay) {
        element.style.transitionDelay = `${delay}ms`;
      }
    });

    const revealInView = () => {
      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight + 80 && rect.bottom > -80) {
          element.classList.add('is-visible');
        }
      });
    };

    // Immediate check on mount
    revealInView();

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '80px 0px' },
    );

    revealElements.forEach((element) => observer.observe(element));

    window.addEventListener('scroll', revealInView, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', revealInView);
    };
  }, []);

  return (
    <div className="landing-dark min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-uniao-500 selection:text-slate-950">

      {/* Dynamic Ambient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-uniao-600/10 rounded-full blur-[160px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[180px] animate-pulse-glow" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[200px] animate-pulse-glow" style={{ animationDuration: '10s' }} />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        <HeroSection />
        <LegalComplianceSection />
        <TrainingGallerySection />
        <AboutSection />
        <CoursesSection />
        <AudienceSection />
        <MethodologySection />
        <InstructorsSection />
        <FaqSection />
        <ContactSection />
      </main>

      <FloatingWhatsAppButton />
      <Footer />
    </div>
  );
};
