'use client';

import React, { useMemo, useState } from 'react';
import { useAgency } from '@/context/AgencyContext';
import {
  PORTAL_MODULE_LABELS,
  PortalModuleKey,
} from '@/data/portalAccounts';
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface PortalAdminPanelProps {
  clientId: string;
  clientName?: string;
}

export default function PortalAdminPanel({ clientId, clientName }: PortalAdminPanelProps) {
  const {
    getPortalForClient,
    createPortalAccount,
    updatePortalAccount,
    resetPortalPassword,
    deletePortalAccount,
    navigate,
  } = useAgency();

  const account = getPortalForClient(clientId);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const modules = useMemo(
    () => (Object.keys(PORTAL_MODULE_LABELS) as PortalModuleKey[]),
    []
  );

  const create = () => {
    const { account: acc, password } = createPortalAccount(clientId);
    setRevealedPassword(password);
    setShowPassword(true);
  };

  const reset = () => {
    if (!account) return;
    if (!confirm('Reset portal password? The old one will stop working.')) return;
    const password = resetPortalPassword(account.id);
    setRevealedPassword(password);
    setShowPassword(true);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  const toggleModule = (key: PortalModuleKey) => {
    if (!account) return;
    updatePortalAccount(account.id, {
      modules: { ...account.modules, [key]: !account.modules[key] },
    });
  };

  return (
    <div className="rounded-2xl border border-[#1e2a22] bg-[#0f1a16] p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[#2dd4bf] font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Client portal access
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">
            {clientName ? `Credentials & visibility for ${clientName}` : 'Portal credentials & module toggles'}
          </p>
        </div>
        {!account ? (
          <button
            type="button"
            onClick={create}
            className="px-3 py-2 rounded-xl bg-[#2dd4bf] text-[#052e24] text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create portal
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              navigate({ tab: 'portal' });
            }}
            className="px-3 py-2 rounded-xl border border-[#2dd4bf]/40 text-[#2dd4bf] text-xs font-bold"
          >
            Open portal view
          </button>
        )}
      </div>

      {!account && (
        <p className="text-[11px] text-[#6b7280]">
          No portal yet. Create one to issue a username/password and choose what this client can see.
        </p>
      )}

      {account && (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#0b1210] border border-[#1e2a22] p-3">
              <p className="text-[9px] uppercase text-[#6b7280] font-bold">Username</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-white font-mono flex-1 truncate">{account.username}</code>
                <button type="button" onClick={() => copy(account.username)} className="text-[#9ca3af] hover:text-white">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-[#0b1210] border border-[#1e2a22] p-3">
              <p className="text-[9px] uppercase text-[#6b7280] font-bold">Password</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-white font-mono flex-1 truncate">
                  {showPassword && revealedPassword
                    ? revealedPassword
                    : showPassword
                      ? account.password
                      : '••••••••••'}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword((v) => !v);
                    if (!revealedPassword) setRevealedPassword(account.password);
                  }}
                  className="text-[#9ca3af] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => copy(revealedPassword || account.password)}
                  className="text-[#9ca3af] hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {revealedPassword && (
                <p className="text-[10px] text-[#fbbf24] mt-1">Copy this password now — store it securely.</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updatePortalAccount(account.id, { enabled: !account.enabled })}
              className="px-3 py-2 rounded-xl border border-[#1e2a22] text-xs font-bold text-white flex items-center gap-1.5"
            >
              {account.enabled ? (
                <ToggleRight className="w-4 h-4 text-[#2dd4bf]" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-[#6b7280]" />
              )}
              {account.enabled ? 'Enabled' : 'Disabled'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-3 py-2 rounded-xl border border-[#1e2a22] text-xs font-bold text-[#fbbf24] flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset password
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirm('Delete this portal account?')) return;
                deletePortalAccount(account.id);
                setRevealedPassword(null);
              }}
              className="px-3 py-2 rounded-xl border border-[#7f1d1d]/40 text-[#f87171] text-xs font-bold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#6b7280] font-bold mb-2 flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> Visible modules
            </p>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {modules.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#0b1210] border border-[#1e2a22] text-[11px] text-[#e5e7eb] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!account.modules[key]}
                    onChange={() => toggleModule(key)}
                  />
                  {PORTAL_MODULE_LABELS[key]}
                </label>
              ))}
            </div>
          </div>

          {account.lastLoginAt && (
            <p className="text-[10px] text-[#6b7280]">
              Last login {new Date(account.lastLoginAt).toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}
