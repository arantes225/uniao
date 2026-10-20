import React, { useState } from 'react';
import { X, User, Check, KeyRound, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name: string;
    cpf: string;
    email: string;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name || 'Dr(a). Aluno(a) União');
  const [cpf, setCpf] = useState(initialData?.cpf || '123.456.789-00');
  const [email, setEmail] = useState(initialData?.email || 'aluno@uniaoservicosmedicos.com.br');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação caso o aluno queira alterar a senha
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setError('A nova senha deve ter no mínimo 6 caracteres.');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('A confirmação de senha não confere com a nova senha digitada.');
        setLoading(false);
        return;
      }

      try {
        // Atualiza a senha no Supabase Auth
        const { error: pwdErr } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (pwdErr) throw pwdErr;
      } catch (err: any) {
        setError(err.message || 'Erro ao alterar senha.');
        setLoading(false);
        return;
      }
    }

    try {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1400);
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
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dados atualizados com sucesso!</span>
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
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
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
