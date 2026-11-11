import React, { useState } from 'react';
import {
  ShieldCheck,
  Bot,
  AlertTriangle,
  Calendar,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Lock,
  UserCheck,
  Sparkles,
  CheckCircle2,
  MapPin,
  Scale,
  KeyRound,
} from 'lucide-react';
import { PartnerItem, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface LoginWelcomePageProps {
  partners: PartnerItem[];
  onLogin: (role: UserRole, targetTab?: string) => void;
}

export const LoginWelcomePage: React.FC<LoginWelcomePageProps> = ({
  partners,
  onLogin,
}) => {
  const [identifier, setIdentifier] = useState('BG-1042');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ASSOCIATO');
  const [selectedPartnerCategory, setSelectedPartnerCategory] = useState<string>('ALL');
  const [showAllPartnersModal, setShowAllPartnersModal] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, 'dashboard');
  };

  const handleRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    const presetUser = DEMO_USERS[role];
    setIdentifier(presetUser.codiceAssociato);
  };

  const filteredPartners =
    selectedPartnerCategory === 'ALL'
      ? partners
      : partners.filter((p) => p.category === selectedPartnerCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Institutional Banner */}
      <header className="bg-[#0A2540] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B1E24] text-white font-semibold tracking-wide uppercase text-[11px]">
              Sede Provinciale Bergamo
            </span>
            <span className="text-slate-300 hidden md:inline">
              Associazione Nazionale Amministratori Condominiali e Immobiliari • Via Vincenzo Bellini 43, Bergamo
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8B1E24]" /> Via V. Bellini 43, 24129 BG
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline font-mono text-xs text-emerald-300">
              ● Portale Associati & ANACI Servizi Integrati srl
            </span>
          </div>
        </div>
      </header>

      {/* Main Split Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (7 cols): Institutional Welcome + Quick Actions + Partner Showcase */}
          <div className="lg:col-span-7 space-y-8">
            {/* Hero Identity Block */}
            <div className="bg-[#0A2540] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#12385E] relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <span className="text-[#0A2540] font-extrabold text-lg tracking-tighter">
                      ANACI
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        ANACI BG Hub
                      </h1>
                      <span className="px-2 py-0.5 text-xs font-bold bg-[#8B1E24] text-white rounded">
                        BERGAMO
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Piattaforma Collaborativa, Intelligenza Artificiale e Rete Fornitori Convenzionati
                    </p>
                  </div>
                </div>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                  L’ecosistema digitale riservato agli Amministratori Condominiali di{' '}
                  <strong className="text-white">ANACI Bergamo</strong>: confrontati in tempo reale sui casi critici, interroga l’assistente legale RAG, prenota la sala assemblee di Via Bellini 43 e contatta in un clic i{' '}
                  <strong className="text-white">21 Partner Ufficiali</strong> convenzionati.
                </p>

                {/* Quick-Actions Bar requested in Section 1 */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Scorciatoie Rapide (Quick-Actions)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => onLogin(selectedRole, 'ai-bot')}
                      className="group text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="p-2 rounded-lg bg-[#8B1E24] text-white">
                          <Bot className="w-4 h-4" />
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">Chiedi ad ANACI Bot</div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          RAG Art. 1117-1139 c.c. & Trib. BG
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onLogin(selectedRole, 'sos-board')}
                      className="group text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="p-2 rounded-lg bg-amber-600 text-white">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">SOS Condominio</div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          Casi Critici & Pareri Centro Studi
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onLogin(selectedRole, 'training')}
                      className="group text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="p-2 rounded-lg bg-emerald-600 text-white">
                          <Calendar className="w-4 h-4" />
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">Formazione & Eventi</div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          Crediti DM 140/2014 & Sala Bellini
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Public / Semi-Public Dynamic Showcase: "I Nostri Partner e Sponsor" */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FDF2F3] text-[#8B1E24] border border-[#8B1E24]/20">
                      ANACI Servizi Integrati srl
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      21 Aziende Verificate
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0A2540] mt-1">
                    I Nostri Partner e Sponsor Convenzionati
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Fornitori selezionati per gli studi ANACI Bergamo con canale diretto per sopralluoghi e preventivi.
                  </p>
                </div>
                <button
                  onClick={() => onLogin(selectedRole, 'partners')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A2540] hover:bg-[#12385E] text-white text-xs sm:text-sm font-semibold transition shrink-0"
                >
                  Scopri tutte le convenzioni ({partners.length})
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
                {[
                  { key: 'ALL', label: 'Tutti i 21 Partner' },
                  { key: 'ENERGIA_CALORE', label: 'Energia, Gas & Calore (6)' },
                  { key: 'IMPIANTI_SICUREZZA', label: 'Impianti, Ascensori & Sicurezza (6)' },
                  { key: 'PULIZIE_MULTISERVIZI', label: 'Pulizie & Servizi Condominio (6)' },
                  { key: 'STUDIO_FISCO_CREDITI', label: 'Fisco, Studio & Recupero Crediti (3)' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedPartnerCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedPartnerCategory === cat.key
                        ? 'bg-[#8B1E24] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Partner Showcase Grid (Compact Preview) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2 max-h-[380px] overflow-y-auto pr-1">
                {filteredPartners.map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => onLogin(selectedRole, 'partners')}
                    className="group cursor-pointer p-3.5 rounded-xl border border-slate-200 hover:border-[#0A2540] bg-slate-50/60 hover:bg-white transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#0A2540] text-white font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-[#8B1E24] transition">
                          {partner.logoInitials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#0A2540] truncate">
                            {partner.companyName}
                          </h3>
                          <p className="text-[11px] text-slate-500 truncate">{partner.sector}</p>
                        </div>
                      </div>
                      {partner.referentName && (
                        <p className="mt-2 text-[11px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200/80 truncate">
                          Ref: <strong className="text-slate-800">{partner.referentName}</strong>
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-mono font-medium text-[#0A2540]">{partner.phone}</span>
                      <span className="text-[#8B1E24] font-semibold group-hover:underline">
                        Scheda →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Login Card & Role Simulator */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B1E24]">
                    Area Riservata RBAC
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0A2540] mt-0.5">
                    Accedi ad ANACI BG Hub
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A2540]">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              {/* Role Selector (RBAC Demo Presets) */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Seleziona Profilo Ruolo (RBAC Demo Interattiva):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      {
                        role: 'ASSOCIATO',
                        title: 'Associato ANACI BG',
                        sub: 'Dott. Marco Locatelli (#BG-1042)',
                      },
                      {
                        role: 'ESPERTO',
                        title: 'Esperto Centro Studi',
                        sub: 'Avv. Chiara Belotti (Legale)',
                      },
                      {
                        role: 'PARTNER',
                        title: 'Partner / Sponsor',
                        sub: 'Ilario Centimerio (BGL)',
                      },
                      {
                        role: 'ADMIN',
                        title: 'Admin Direttivo BG',
                        sub: 'Geom. Roberto Rota',
                      },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRolePreset(item.role)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedRole === item.role
                          ? 'border-[#8B1E24] bg-[#FDF2F3]/70 ring-1 ring-[#8B1E24]'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0A2540]">{item.title}</span>
                        {selectedRole === item.role && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8B1E24]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email o Codice Associato ANACI Bergamo
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Es. BG-1042 oppure nome@studio.it"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent font-medium"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setRecoverySent(true)}
                      className="text-xs font-semibold text-[#8B1E24] hover:underline"
                    >
                      Recupero credenziali?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:border-transparent"
                    required
                  />
                </div>

                {recoverySent && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                    <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      Link di ripristino credenziali inviato alla PEC/Email depositata presso la Segreteria ANACI Bergamo (Via V. Bellini 43).
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#8B1E24] hover:bg-[#A3242B] text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Entra nella Dashboard ({DEMO_USERS[selectedRole].roleLabel})
                </button>
              </form>

              {/* Permissions Summary for Selected Role */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0A2540]" />
                  Permessi attivi per il ruolo selezionato:
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  {selectedRole === 'ASSOCIATO' && (
                    <>
                      <li>• Accesso completo a Chiedi ad ANACI Bot, Generatore Verbali e Simulatore Riparto</li>
                      <li>• Pubblicazione su SOS Condominio (anche in modalità anonima) e Voto Utile</li>
                      <li>• Richiesta Preventivi in Convenzione e lettura/scrittura Feedback riservati</li>
                    </>
                  )}
                  {selectedRole === 'ESPERTO' && (
                    <>
                      <li>• Emissione Pareri Ufficiali Centro Studi ANACI BG sui ticket tecnici e legali</li>
                      <li>• Pubblicazione nella Knowledge Base / Rassegna Tribunale di Bergamo</li>
                      <li>• Accesso agli strumenti RAG di verifica giurisprudenziale</li>
                    </>
                  )}
                  {selectedRole === 'PARTNER' && (
                    <>
                      <li>• Gestione vetrina aziendale ANACI Servizi Integrati srl e caricamento brochure</li>
                      <li>• Ricezione e presa in carico Richieste di Preventivo / Sopralluogo dagli Associati</li>
                      <li>• Nota: i feedback riservati tra associati restano protetti da privacy interna</li>
                    </>
                  )}
                  {selectedRole === 'ADMIN' && (
                    <>
                      <li>• Governance completa Direttivo ANACI Bergamo, moderazione SOS e gestione utenti</li>
                      <li>• Creazione Eventi DM 140/2014, Sondaggi Rapidi e gestione Sala Via V. Bellini 43</li>
                      <li>• Supervisione convenzioni ANACI Servizi Integrati srl</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
