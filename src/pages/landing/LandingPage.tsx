import React from 'react';
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
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
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
