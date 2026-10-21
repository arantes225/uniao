import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CertificateValidationPage } from './pages/public/CertificateValidationPage';
import { StudentLayout } from './components/layout/StudentLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { VideosPage } from './pages/student/VideosPage';
import { IntegratedLessonPage } from './pages/student/IntegratedLessonPage';
import { ClinicalSimulatorPage } from './pages/student/ClinicalSimulatorPage';
import { MaterialsPage } from './pages/student/MaterialsPage';
import { ExamsPage } from './pages/student/ExamsPage';
import { CertificatesPage } from './pages/student/CertificatesPage';
import { PresencePage } from './pages/student/PresencePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import { ThemeProvider } from './context/ThemeContext';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // O ambiente do aluno usa um painel interno com rolagem própria.
    document.querySelectorAll<HTMLElement>('main').forEach(main => {
      main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [location.pathname, location.hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
        {/* Site Institucional Público */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Validação Pública de Certificados */}
        <Route path="/validar-certificado" element={<CertificateValidationPage />} />
        <Route path="/validar-certificado/:code" element={<CertificateValidationPage />} />
        
        {/* Autenticação (Acesso Privado sem cadastro público) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ambiente de Aprendizagem do Aluno com Layout e Sidebar */}
        <Route path="/aluno" element={<StudentLayout />}>
          <Route index element={<Navigate to="/aluno/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="aula/:lessonSlug" element={<IntegratedLessonPage />} />
          <Route path="materiais" element={<MaterialsPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="provas" element={<ExamsPage />} />
          <Route path="simulador" element={<ClinicalSimulatorPage />} />
          <Route path="certificados" element={<CertificatesPage />} />
          <Route path="frequencia" element={<PresencePage />} />
          <Route path="presencial" element={<PresencePage />} />
        </Route>

        {/* Painel Administrativo Protegido */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback de rotas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </ThemeProvider>
  );
};

export default App;

