import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CertificateValidationPage } from './pages/public/CertificateValidationPage';
import { StudentLayout } from './components/layout/StudentLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { IntegratedLessonPage } from './pages/student/IntegratedLessonPage';
import { ClinicalSimulatorPage } from './pages/student/ClinicalSimulatorPage';
import { MaterialsPage } from './pages/student/MaterialsPage';
import { ExamsPage } from './pages/student/ExamsPage';
import { CertificatesPage } from './pages/student/CertificatesPage';
import { PresencePage } from './pages/student/PresencePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import { ThemeProvider } from './context/ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
        {/* Site Institucional Público */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Validação Pública de Certificados */}
        <Route path="/validar-certificado" element={<CertificateValidationPage />} />
        <Route path="/validar-certificado/:code" element={<CertificateValidationPage />} />
        
        {/* Autenticação (Acesso Privado sem cadastro público) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Simulador Clínico com visual imersivo / Luria UI (Sem sidebar colidindo) */}
        <Route path="/aluno/simulador" element={<ClinicalSimulatorPage />} />

        {/* Ambiente de Aprendizagem do Aluno com Layout e Sidebar */}
        <Route path="/aluno" element={<StudentLayout />}>
          <Route index element={<Navigate to="/aluno/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="aula/:lessonSlug" element={<IntegratedLessonPage />} />
          <Route path="materiais" element={<MaterialsPage />} />
          <Route path="videos" element={<StudentDashboard />} />
          <Route path="provas" element={<ExamsPage />} />
          <Route path="certificados" element={<CertificatesPage />} />
          <Route path="frequencia" element={<PresencePage />} />
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
