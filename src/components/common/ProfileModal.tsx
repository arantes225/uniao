import React, { useEffect, useState } from 'react';
import { X, User, Check, KeyRound, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (name: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recarrega os dados reais a cada abertura; nunca apresenta dados de exemplo.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoadingProfile(true);
    setProfileLoaded(false);
    setSaved(false);
    setSuccessMessage('');
    setError(null);
    setNewPassword('');
    setConfirmPassword('');

    const loadProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('Sessão expirada. Entre novamente para editar o perfil.');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, cpf')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;
        if (!cancelled) {
          setName(profile.full_name || '');
          setCpf(profile.cpf || '');
          setEmail(user.email || '');
          setProfileLoaded(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar o perfil.');
        }
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };
    void loadProfile();
    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !profileLoaded) return;
    setError(null);
    setSaved(false);
    setSuccessMessage('');

    const fullName = name.trim();
    const digits = cpf.replace(/\D/g, '');
    const desiredEmail = email.trim().toLowerCase();

    if (fullName.length < 2) {
      setError('Informe o nome completo que deve constar no certificado.');
      return;
    }
    if (digits.length > 0 && digits.length !== 11) {
      setError('O CPF deve conter 11 dígitos, ou ficar em branco.');
      return;
    }
    if (!desiredEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(desiredEmail)) {
      setError('Informe um endereço de e-mail válido.');
      return;
    }
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setError('A nova senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('A confirmação de senha não confere com a nova senha digitada.');
        return;
      }
    }

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Sua sessão expirou. Entre novamente para salvar os dados.');

      // A tabela pública possui RLS: somente o próprio usuário pode alterar esta linha.
      // .select().single() evita exibir sucesso se o UPDATE não afetar nenhuma linha.
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, cpf: digits || null })
        .eq('id', user.id)
        .select('id')
        .single();
      if (profileError) throw profileError;
      onSaved?.(fullName);

      const failures: string[] = [];
      let pendingEmailConfirmation = false;

      // O e-mail de login é alterado no Auth; só sincroniza o perfil se já
      // estiver confirmado. Caso contrário, a confirmação ocorre por e-mail.
      if (desiredEmail !== (user.email || '').toLowerCase()) {
        const { data: emailResult, error: emailError } = await supabase.auth.updateUser({
          email: desiredEmail,
        });
        if (emailError) {
          failures.push('Não foi possível alterar o e-mail: ' + emailError.message);
        } else if (emailResult.user?.email?.toLowerCase() === desiredEmail) {
          const { error: syncError } = await supabase.from('profiles')
            .update({ email: desiredEmail }).eq('id', user.id);
          if (syncError) failures.push('O e-mail foi alterado no login, mas não sincronizou com o perfil: ' + syncError.message);
        } else {
          pendingEmailConfirmation = true;
        }
      }

      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (passwordError) failures.push('Não foi possível alterar a senha: ' + passwordError.message);
        else {
          setNewPassword('');
          setConfirmPassword('');
        }
      }

      if (failures.length > 0) {
        setError('Nome e CPF salvos. ' + failures.join(' '));
      } else {
        setSaved(true);
        setSuccessMessage(pendingEmailConfirmation
          ? 'Nome e CPF salvos. Confirme a troca do e-mail pelo link enviado para concluir a alteração.'
          : 'Dados atualizados com sucesso!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar as alterações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-uniao-500/10 text-uniao-400 border border-uniao-500/30 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dados do Perfil Acadêmico</h3>
              <p className="text-xs text-slate-400">Informações vinculadas à emissão de certificados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-5">
          {loadingProfile && <p className="text-xs text-slate-400">Carregando os dados do perfil...</p>}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Nome Completo
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-uniao-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Nome que constará no certificado de conclusão e nos registros de frequência.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              CPF
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-uniao-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Protegido conforme a Lei Geral de Proteção de Dados (LGPD).
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              E-mail Institucional
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-uniao-500"
              />
            </div>
          </div>

          {/* SEÇÃO DE ALTERAÇÃO E CONFIRMAÇÃO DE SENHA */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-uniao-400 uppercase tracking-wider">
              <KeyRound className="w-4 h-4" />
              <span>Alterar Senha de Acesso</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Nova Senha (deixe em branco para manter)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-uniao-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-uniao-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || loadingProfile || !profileLoaded}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow transition-all"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
