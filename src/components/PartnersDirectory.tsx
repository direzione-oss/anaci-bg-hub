import React, { useState } from 'react';
import {
  Search,
  Phone,
  Mail,
  User,
  MapPin,
  Star,
  FileText,
  MessageSquareLock,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Send,
  X,
  Plus,
  Filter,
} from 'lucide-react';
import { PartnerItem, PartnerCategoryKey, UserProfile } from '../types';

interface PartnersDirectoryProps {
  partners: PartnerItem[];
  currentUser: UserProfile;
  onAddPartnerReview: (
    partnerId: number,
    rating: number,
    intervento: string,
    zona: string,
    comment: string
  ) => void;
  onQuoteSubmitted: (partnerName: string, condominio: string, tipo: string) => void;
}

const CATEGORIES: { key: 'ALL' | PartnerCategoryKey; label: string; count: number }[] = [
  { key: 'ALL', label: 'Tutti i Partner Convenzionati', count: 21 },
  {
    key: 'ENERGIA_CALORE',
    label: 'Energia Elettrica, Gas e Contabilizzazione Calore',
    count: 6,
  },
  {
    key: 'IMPIANTI_SICUREZZA',
    label: 'Impianti, Manutenzione, Sicurezza e Certificazioni',
    count: 6,
  },
  {
    key: 'PULIZIE_MULTISERVIZI',
    label: 'Pulizie, Disinfestazione e Servizi al Condominio',
    count: 6,
  },
  {
    key: 'STUDIO_FISCO_CREDITI',
    label: 'Servizi per lo Studio, Fisco e Recupero Crediti',
    count: 3,
  },
];

const BERGAMO_ZONES = [
  'Tutte le zone (BG)',
  'Bergamo Città',
  'Città Alta',
  'Val Seriana',
  'Val Brembana',
  'Isola Bergamasca',
  'Bassa Bergamasca',
];

export const PartnersDirectory: React.FC<PartnersDirectoryProps> = ({
  partners,
  currentUser,
  onAddPartnerReview,
  onQuoteSubmitted,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | PartnerCategoryKey>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('Tutte le zone (BG)');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [quoteModalPartner, setQuoteModalPartner] = useState<PartnerItem | null>(null);
  const [feedbackModalPartner, setFeedbackModalPartner] = useState<PartnerItem | null>(null);

  // Pre-filled Quote Form state
  const [condominioScelto, setCondominioScelto] = useState(
    currentUser.condominiGestiti?.[0] || 'Condominio Parco Suardi — Via B. Bono 14, Bergamo'
  );
  const [tipoRichiesta, setTipoRichiesta] = useState('Sopralluogo Tecnico + Preventivo in Convenzione');
  const [urgenzaRichiesta, setUrgenzaRichiesta] = useState('NORMALE');
  const [noteRichiesta, setNoteRichiesta] = useState('');
  const [quoteSuccessBanner, setQuoteSuccessBanner] = useState<string | null>(null);

  // New Review state
  const [newRating, setNewRating] = useState(5);
  const [newIntervento, setNewIntervento] = useState('');
  const [newZona, setNewZona] = useState('Bergamo Città');
  const [newComment, setNewComment] = useState('');

  const canViewPrivateReviews = currentUser.role !== 'PARTNER';

  const filteredPartners = partners.filter((partner) => {
    const matchesCat = selectedCategory === 'ALL' || partner.category === selectedCategory;
    const matchesZone =
      selectedZone === 'Tutte le zone (BG)' ||
      partner.zoneCoperte.some((z) => z.toLowerCase().includes(selectedZone.toLowerCase()));
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      partner.companyName.toLowerCase().includes(q) ||
      partner.sector.toLowerCase().includes(q) ||
      (partner.referentName && partner.referentName.toLowerCase().includes(q)) ||
      partner.descrizioneServizi.toLowerCase().includes(q);
    return matchesCat && matchesZone && matchesSearch;
  });

  const handleOpenQuoteModal = (partner: PartnerItem) => {
    setQuoteModalPartner(partner);
    setNoteRichiesta(
      `Richiesta in convenzione ANACI Bergamo per ${partner.sector.toLowerCase()}. Si richiede contatto col referente per concordare sopralluogo e offerta riservata.`
    );
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalPartner) return;
    onQuoteSubmitted(quoteModalPartner.companyName, condominioScelto, tipoRichiesta);
    setQuoteSuccessBanner(
      `Richiesta in Convenzione ANACI BG inviata a ${quoteModalPartner.companyName} (${
        quoteModalPartner.referentName || quoteModalPartner.email || quoteModalPartner.phone
      }) per "${condominioScelto}".`
    );
    setQuoteModalPartner(null);
    setTimeout(() => setQuoteSuccessBanner(null), 7000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackModalPartner || !newComment.trim()) return;
    onAddPartnerReview(
      feedbackModalPartner.id,
      newRating,
      newIntervento || feedbackModalPartner.sector,
      newZona,
      newComment
    );
    setNewIntervento('');
    setNewComment('');
  };

  // Keep feedbackModalPartner synced with latest reviews
  const activeFeedbackPartner = feedbackModalPartner
    ? partners.find((p) => p.id === feedbackModalPartner.id) || feedbackModalPartner
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0A2540] text-white rounded-2xl p-6 border border-[#12385E] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1E24] text-white uppercase tracking-wider">
              ANACI Servizi Integrati srl
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
              Albo Fornitori & Manutentori Certificati Bergamo e Provincia
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Area Convenzioni e Vetrina Partner Ufficiali (21 Aziende)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Contatta i referenti dedicati agli Amministratori ANACI Bergamo, avvia chiamate rapide, invia richieste di preventivo precompilate con i dati del tuo studio e consulta i feedback riservati dei colleghi.
          </p>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-xl p-4 shrink-0 text-xs space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Studio Accreditato per Convenzioni:
          </div>
          <div className="text-slate-200 font-medium">{currentUser.studioName}</div>
          <div className="text-slate-300 font-mono">
            Codice: {currentUser.codiceAssociato} • {currentUser.fullName}
          </div>
        </div>
      </div>

      {quoteSuccessBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{quoteSuccessBanner}</span>
          </div>
          <button
            onClick={() => setQuoteSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search, Category Tabs & Territorial Zone Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca fornitore (es. Bergamo Gas, Duelle Lift, MOCIT), referente (es. Ilario, Stefano) o settore..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
            />
          </div>

          {/* Bergamo Zone Filter */}
          <div className="md:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
            >
              {BERGAMO_ZONES.map((z) => (
                <option key={z} value={z}>
                  Zona Coperta: {z}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Official Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedCategory === cat.key
                  ? 'bg-[#0A2540] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  selectedCategory === cat.key
                    ? 'bg-[#8B1E24] text-white'
                    : 'bg-white text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-[#0A2540]/60 shadow-sm hover:shadow-md transition flex flex-col justify-between p-5"
          >
            <div>
              {/* Top Row: Logo Monogram + Company + Rating */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-white font-extrabold text-sm flex items-center justify-center shrink-0 border-2 border-[#8B1E24]/40">
                    {partner.logoInitials}
                  </div>
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#8B1E24]">
                      {partner.sector}
                    </span>
                    <h3 className="text-lg font-extrabold text-[#0A2540] leading-tight">
                      {partner.companyName}
                    </h3>
                  </div>
                </div>

                {/* Verified Associate Rating */}
                <button
                  onClick={() => setFeedbackModalPartner(partner)}
                  title="Clicca per leggere i feedback riservati tra associati"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shrink-0 hover:bg-amber-100 transition"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="tabular-nums">{partner.ratingMedio.toFixed(1)}</span>
                  <span className="text-[10px] text-amber-700 font-normal">
                    ({partner.reviews.length})
                  </span>
                </button>
              </div>

              {/* Category Label & Zone Tags */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                  {partner.categoryLabel}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                  {partner.badgeConvenzione}
                </span>
              </div>

              {/* Service Description & ANACI BG Advantage */}
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {partner.descrizioneServizi}
              </p>
              <div className="mt-2.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs">
                <span className="font-bold text-[#0A2540]">Vantaggio Convenzione ANACI BG: </span>
                <span className="text-slate-700">{partner.vantaggiAssociati}</span>
              </div>

              {/* Direct Contact Info Box (Referent, Click-to-call Phone, Email) */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                {partner.referentName ? (
                  <div className="flex items-center justify-between bg-[#FDF2F3] px-3 py-1.5 rounded-lg border border-[#8B1E24]/20">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#8B1E24]" /> Referente ANACI:
                    </span>
                    <span className="font-bold text-[#0A2540]">{partner.referentName}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> Canale Ufficiale:
                    </span>
                    <span className="font-semibold text-slate-700">Desk Convenzioni ANACI BG</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={`tel:${partner.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-[#0A2540] hover:text-white text-[#0A2540] font-mono font-semibold transition"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0 text-[#8B1E24] group-hover:text-white" />
                    <span className="truncate">{partner.phone}</span>
                  </a>

                  {partner.email ? (
                    <a
                      href={`mailto:${partner.email}?subject=Richiesta%20in%20Convenzione%20ANACI%20Bergamo%20-%20${encodeURIComponent(
                        currentUser.studioName
                      )}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition truncate"
                      title={partner.email}
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#0A2540]" />
                      <span className="truncate">{partner.email}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 text-slate-500 italic">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Numero Verde Dedicato</span>
                    </div>
                  )}
                </div>

                {/* Zones covered */}
                <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">Zone: {partner.zoneCoperte.join(' • ')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Pre-filled Quote + Reserved Associates Feedback */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
              <button
                onClick={() => handleOpenQuoteModal(partner)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#8B1E24] hover:bg-[#A3242B] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 shrink-0" />
                Richiedi Preventivo / Sopralluogo in Convenzione ANACI BG
              </button>

              <button
                onClick={() => setFeedbackModalPartner(partner)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A2540] font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <MessageSquareLock className="w-3.5 h-3.5 text-[#0A2540]" />
                Feedback riservato tra associati ({partner.reviews.length} pareri colleghi)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Pre-filled "Richiedi Preventivo / Sopralluogo in Convenzione ANACI BG" */}
      {quoteModalPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Modulo Precompilato in Convenzione ANACI BG
                </span>
                <h3 className="text-lg font-bold">
                  Richiesta a {quoteModalPartner.companyName}
                </h3>
              </div>
              <button
                onClick={() => setQuoteModalPartner(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuote} className="p-6 space-y-4 text-sm">
              {/* Pre-filled Studio Data */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-[#0A2540] uppercase tracking-wider text-[11px]">
                  Dati Studio Amministratore Richiedente (Precompilati):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500">Studio:</span>{' '}
                    <strong className="text-slate-800">{currentUser.studioName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Associato:</span>{' '}
                    <strong className="text-slate-800">
                      {currentUser.fullName} ({currentUser.codiceAssociato})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Destinatario:</span>{' '}
                    <strong className="text-[#8B1E24]">
                      {quoteModalPartner.referentName || quoteModalPartner.companyName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Recapito Partner:</span>{' '}
                    <strong className="font-mono">{quoteModalPartner.phone}</strong>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Condominio Oggetto di Preventivo / Sopralluogo
                </label>
                <input
                  type="text"
                  value={condominioScelto}
                  onChange={(e) => setCondominioScelto(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  required
                />
                {currentUser.condominiGestiti && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {currentUser.condominiGestiti.slice(0, 3).map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setCondominioScelto(cond)}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        {cond.split('—')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipologia Richiesta
                  </label>
                  <select
                    value={tipoRichiesta}
                    onChange={(e) => setTipoRichiesta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option>Sopralluogo Tecnico + Preventivo in Convenzione</option>
                    <option>Offerta Economica da Capitolato / Bilancio</option>
                    <option>Pronto Intervento Urgente Condominiale</option>
                    <option>Verifica Normativa / Adeguamento Obbligatorio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priorità Operativa
                  </label>
                  <select
                    value={urgenzaRichiesta}
                    onChange={(e) => setUrgenzaRichiesta(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="NORMALE">Ordinaria (per prossima Assemblea)</option>
                    <option value="ALTA">Alta (entro 5 giorni lavorativi)</option>
                    <option value="CRITICA">Urgente / Guasto Bloccante (entro 24h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dettagli Tecnici e Note per il Referente ({quoteModalPartner.sector})
                </label>
                <textarea
                  rows={3}
                  value={noteRichiesta}
                  onChange={(e) => setNoteRichiesta(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalPartner(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B1E24] hover:bg-[#A3242B] text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Invia Richiesta Ufficiale in Convenzione
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Feedback Riservato tra Associati ANACI BG */}
      {activeFeedbackPartner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquareLock className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                    Area Riservata Esclusivamente agli Associati Verificati ANACI BG
                  </span>
                  <h3 className="text-lg font-bold">
                    Feedback Colleghi su {activeFeedbackPartner.companyName}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setFeedbackModalPartner(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {!canViewPrivateReviews ? (
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                  <strong>Protezione RBAC Attiva:</strong> Stai visualizzando la piattaforma con il ruolo{' '}
                  <code>PARTNER/SPONSOR</code>. Come previsto dalle specifiche ANACI BG Hub, la sezione{' '}
                  <em>Feedback riservato tra associati</em> è consultabile e compilabile esclusivamente dagli Amministratori Associati verificati e dal Direttivo.
                </div>
              ) : (
                <>
                  {/* Existing Reviews List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Recensioni Verificate dei Colleghi di Bergamo ({activeFeedbackPartner.reviews.length})
                    </h4>
                    {activeFeedbackPartner.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0A2540]">
                              {rev.authorAlias}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                              {rev.zonaCondominio}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                            {'★'.repeat(rev.rating)}
                            <span className="text-slate-400 font-normal ml-1">{rev.date}</span>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-[#8B1E24]">
                          Intervento: {rev.intervento}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Form to Add Verified Associate Feedback */}
                  <form
                    onSubmit={handleSubmitReview}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3"
                  >
                    <div className="text-xs font-bold text-[#0A2540] flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#8B1E24]" />
                      Aggiungi il tuo Feedback Riservato per i colleghi ANACI BG
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Valutazione (1-5 ★)
                        </label>
                        <select
                          value={newRating}
                          onChange={(e) => setNewRating(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                        >
                          <option value={5}>★★★★★ (5/5 Eccellente)</option>
                          <option value={4}>★★★★☆ (4/5 Molto Buono)</option>
                          <option value={3}>★★★☆☆ (3/5 Nella media)</option>
                          <option value={2}>★★☆☆☆ (2/5 Critico)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Zona Condominio
                        </label>
                        <select
                          value={newZona}
                          onChange={(e) => setNewZona(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                        >
                          <option>Bergamo Città</option>
                          <option>Città Alta</option>
                          <option>Val Seriana</option>
                          <option>Val Brembana</option>
                          <option>Isola Bergamasca</option>
                          <option>Bassa Bergamasca</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Oggetto Intervento
                        </label>
                        <input
                          type="text"
                          value={newIntervento}
                          onChange={(e) => setNewIntervento(e.target.value)}
                          placeholder="Es. Manutenzione annuale"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Condividi tempi di risposta, rispetto del preventivo in convenzione e affidabilità tecnica..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Pubblicato come: <strong>Studio Associato #{currentUser.codiceAssociato}</strong>
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#0A2540] hover:bg-[#12385E] text-white text-xs font-bold"
                      >
                        Salva Feedback Riservato
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
