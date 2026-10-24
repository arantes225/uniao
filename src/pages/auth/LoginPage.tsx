import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Modos de visualização da tela de login: 'login' | 'reset' | 'first_access'
  const [viewMode, setViewMode] = useState<'login' | 'reset' | 'first_access'>('login');

  // O HashRouter precisa receber o destino depois que o link de acesso for confirmado.
  const postAuthRedirect = () => `${window.location.origin}${window.location.pathname}#/aluno/dashboard`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Autenticação no Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        throw new Error('E-mail ou senha incorretos. Caso ainda não tenha ativado sua conta, consulte o convite enviado pela administração da União.');
      }

      if (!data.user) {
        throw new Error('Usuário não localizado.');
      }

      // 2. REGRA DO PROMPT MESTRE: Verificar autorização e matrícula prévia
      // O usuário autenticado precisa existir em enrollments ou platform_staff
      const [staffCheck, enrollmentCheck] = await Promise.all([
        supabase.from('platform_staff').select('role').eq('user_id', data.user.id).maybeSingle(),
        supabase.from('enrollments').select('id, status').eq('user_id', data.user.id).maybeSingle(),
      ]);

      const isStaff = !!staffCheck.data;
      const isEnrolled = !!enrollmentCheck.data;

      if (!isStaff && !isEnrolled) {
        // Bloqueia e desloga imediatamente caso não tenha autorização prévia
        await supabase.auth.signOut();
        throw new Error('Seu usuário não possui matrícula ativa ou autorização cadastrada pela União Serviços Médicos. Não é permitido cadastro espontâneo.');
      }

      // Todos os acessos via login caem diretamente no ambiente do aluno
      // O acesso administrativo fica restrito por rota direta (/admin)
      navigate('/aluno/dashboard');

    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: postAuthRedirect(),
        },
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      setError('Falha ao autenticar com Google: ' + err.message);
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${window.location.pathname}#/redefinir-senha`,
      });
      if (resetErr) throw resetErr;
      setSuccessMessage('E-mail de recuperação enviado! Se o e-mail estiver cadastrado, você receberá um link seguro.');
    } catch (err: any) {
      setError(err.message || 'Erro ao solicitar redefinição de senha.');
    } finally {
      setLoading(false);
    }
  };

  // Primeiro acesso e reativação usam o e-mail já cadastrado pela administração.
  // O link é emitido pelo Supabase Auth e não cria cadastro espontâneo.
  const handleFirstAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Informe o e-mail cadastrado pela administração.');
      setLoading(false);
      return;
    }

    try {
      const { data: lookup, error: lookupError } = await supabase.functions.invoke('student-access-lookup', {
        body: { email: normalizedEmail },
      });
      if (lookupError || !lookup?.authorized) {
        throw new Error('E-mail não autorizado pela administração.');
      }

      const { error: accessError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          // Usuários existentes entram; usuários autorizados sem conta concluem o cadastro.
          shouldCreateUser: true,
          emailRedirectTo: postAuthRedirect(),
        },
      });
      if (accessError) throw accessError;

      setSuccessMessage(
        'E-mail reconhecido. Enviamos um link seguro de acesso para você entrar imediatamente na sua conta e visualizar suas turmas.'
      );
    } catch (err: any) {
      setError(
        'Este e-mail ainda não está provisionado pela administração ou não pode ser acessado. Confirme o endereço informado ou peça à administração para cadastrá-lo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-uniao-600/10 blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg border border-slate-700 flex items-center justify-center">
            <img 
              src="./brand/logo-uniao.png" 
              alt="União Serviços Médicos" 
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Área do Aluno
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          União Serviços Médicos — Acesso Educacional Restrito
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700/80">
          
          {/* Mensagens de Alerta / Erro */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          {viewMode === 'reset' ? (
            /* Formulário de Recuperação de Senha */
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="text-sm text-slate-300 mb-2">
                Informe o seu e-mail cadastrado pela instituição para receber o link seguro de recuperação de senha:
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  E-mail institucional cadastrado
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aluno@instituicao.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-uniao-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setViewMode('login'); setError(null); setSuccessMessage(null); }}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancelar e voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-uniao-600 hover:bg-uniao-700 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </button>
              </div>
            </form>
          ) : viewMode === 'first_access' ? (
            /* PRIMEIRO ACESSO POR LINK SEGURO DA CONTA PROVISIONADA */
            <form onSubmit={handleFirstAccess} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-uniao-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Primeiro Acesso ou Novo Acesso</span>
                </div>
                <p className="text-xs text-slate-400">
                  Use o mesmo e-mail cadastrado pela administração. O sistema reconhece seu nome completo e envia um link seguro; depois do acesso, suas turmas e o switch de turma aparecem automaticamente.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  E-mail cadastrado na turma
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aluno@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-uniao-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-uniao-500/20 bg-uniao-500/5 px-4 py-3 text-xs text-slate-300">
                O link de acesso é válido para o primeiro acesso e também para quem já usou a plataforma antes. Ao entrar, o nome completo cadastrado e todas as turmas ativas serão carregados automaticamente.
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setViewMode('login'); setError(null); setSuccessMessage(null); }}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Voltar para o login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow disabled:opacity-50"
                >
                  {loading ? 'Enviando link...' : 'Enviar link e acessar'}
                </button>
              </div>
            </form>
          ) : (
            /* Formulário de Login Principal */
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  E-mail institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aluno@exemplo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-500/40 focus:border-uniao-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => { setViewMode('reset'); setError(null); setSuccessMessage(null); }}
                    className="text-xs text-uniao-400 hover:text-uniao-300 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-500/40 focus:border-uniao-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-uniao-600 bg-slate-900 border-slate-700 focus:ring-uniao-500"
                  />
                  <span className="text-xs text-slate-400">Lembrar de mim</span>
                </label>

                {/* BOTÃO DE PRIMEIRO ACESSO */}
                <button
                  type="button"
                  onClick={() => { setViewMode('first_access'); setError(null); setSuccessMessage(null); }}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Primeiro Acesso?</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-uniao-600 hover:bg-uniao-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <span>Autenticando...</span>
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/80" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-slate-800 text-slate-400">ou acesse com</span>
                </div>
              </div>

              {/* Botão Google com Validação Obrigatória */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-950 border border-slate-700 text-sm font-semibold text-slate-200 transition-all hover:border-slate-600"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar com Google</span>
              </button>

            </form>
          )}

          {/* Aviso Explícito: Não há cadastro público */}
          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-uniao-500" />
              <span>Acesso exclusivo para alunos autorizados.</span>
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Cadastros são provisionados exclusivamente pela administração da União Serviços Médicos.
            </p>
          </div>

        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Voltar para a página institucional
          </Link>
        </div>

      </div>
    </div>
  );
};
