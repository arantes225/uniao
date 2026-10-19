import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CertificateValidationPage } from './pages/public/CertificateValidationPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { IntegratedLessonPage } from './pages/student/IntegratedLessonPage';
import { ClinicalSimulatorPage } from './pages/student/ClinicalSimulatorPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site Institucional Público */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Validação Pública de Certificados */}
        <Route path="/validar-certificado" element={<CertificateValidationPage />} />
        <Route path="/validar-certificado/:code" element={<CertificateValidationPage />} />
        
        {/* Autenticação (Acesso Privado sem cadastro público) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ambiente de Aprendizagem do Aluno */}
        <Route path="/aluno/dashboard" element={<StudentDashboard />} />
        <Route path="/aluno/aula/:lessonSlug" element={<IntegratedLessonPage />} />
        <Route path="/aluno/simulador" element={<ClinicalSimulatorPage />} />

        {/* Painel Administrativo Protegido */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Fallback de rotas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
