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
      { threshold: 0.12, rootMargin: '0px 0px -48px' },
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-dark min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <div data-reveal><HeroSection /></div>
        <div data-reveal><LegalComplianceSection /></div>
        <div data-reveal><TrainingGallerySection /></div>
        <div data-reveal><AboutSection /></div>
        <div data-reveal><CoursesSection /></div>
        <div data-reveal><AudienceSection /></div>
        <div data-reveal><MethodologySection /></div>
        <div data-reveal><InstructorsSection /></div>
        <div data-reveal><FaqSection /></div>
        <div data-reveal><ContactSection /></div>
      </main>
      <FloatingWhatsAppButton />
      <Footer />
    </div>
  );
};
