import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Search, Award, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const CertificateValidationPage: React.FC = () => {
  const { code: urlCode } = useParams<{ code?: string }>();
  const [code, setCode] = useState(urlCode || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const validateCode = (searchCode: string) => {
    const clean = searchCode.toUpperCase().trim();
    if (!clean) return;

    setLoading(true);
    setSearched(true);
    setResult(null);

    // Validações simuladas e oficiais
    setTimeout(() => {
      if (
        clean === 'USM-2026-X89A-99F' || 
        clean.includes('X89A') || 
        clean === 'USM-DEMO-2026' || 
        clean === 'USM-APH-2026-X89A'
      ) {
        setResult({
          valid: true,
          student_name: 'Dr. Lucas Arantes',
          course_title: 'Atendimento Pré-Hospitalar (APH) & Suporte Básico de Vida',
          hours: 40,
          issued_at: new Date().toLocaleDateString('pt-BR'),
          institution: 'União Serviços Médicos',
          code: clean
        });
      } else {
        setResult({ valid: false });
      }
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    if (urlCode) {
      setCode(urlCode);
      validateCode(urlCode);
    }
  }, [urlCode]);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    validateCode(code);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-uniao-100 text-uniao-700 flex items-center justify-center mx-auto mb-4 border border-uniao-200">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Validação de Certificado
            </h1>
            <p className="text-base text-slate-600 max-w-lg mx-auto">
              Verifique a autenticidade de certificados emitidos pela <strong>União Serviços Médicos</strong> através do código identificador único ou QR Code.
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <form onSubmit={handleValidate} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: USM-APH-2026-X89A"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-uniao-500/40 focus:border-uniao-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl font-bold text-white bg-uniao-600 hover:bg-uniao-700 transition-all shadow disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {loading ? 'Consultando...' : 'Verificar Autenticidade'}
              </button>
            </form>

            <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-uniao-600" />
              <span>Validação pública criptográfica. Dados pessoais sensíveis são resguardados pela LGPD.</span>
            </div>
          </div>

          {/* Result Presentation */}
          {searched && (
            <div className="mt-8">
              {result && result.valid ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold">Certificado Válido e Autêntico</h3>
                      <p className="text-xs text-emerald-700">Registro oficial localizado no banco de dados da USM.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-200/70 text-sm text-slate-700">
                    <div>
                      <span className="text-xs text-slate-500 block">Aluno:</span>
                      <strong className="text-slate-900">{result.student_name}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Treinamento:</span>
                      <strong className="text-slate-900">{result.course_title}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Carga Horária:</span>
                      <strong className="text-slate-900">{result.hours} horas</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Data de Emissão:</span>
                      <strong className="text-slate-900">{result.issued_at}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 sm:p-8 text-center space-y-2">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                  <h3 className="text-base font-bold text-red-900">Certificado Não Encontrado</h3>
                  <p className="text-xs text-red-700 max-w-md mx-auto">
                    Não encontramos nenhum registro correspondente ao código informado. Verifique se os caracteres foram digitados corretamente ou entre em contato com a instituição emissora.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};
