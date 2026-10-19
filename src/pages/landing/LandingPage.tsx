import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { HeroSection } from '../../components/landing/HeroSection';
import { AboutSection } from '../../components/landing/AboutSection';
import { CoursesSection } from '../../components/landing/CoursesSection';
import { TrainingGallerySection } from '../../components/landing/TrainingGallerySection';
import { AudienceSection } from '../../components/landing/AudienceSection';
import { MethodologySection } from '../../components/landing/MethodologySection';
import { InstructorsSection } from '../../components/landing/InstructorsSection';
import { ContactSection } from '../../components/landing/ContactSection';
import { Footer } from '../../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrainingGallerySection />
        <AboutSection />
        <CoursesSection />
        <AudienceSection />
        <MethodologySection />
        <InstructorsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};
