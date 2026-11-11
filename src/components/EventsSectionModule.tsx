import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  Award,
  ExternalLink,
  CheckCircle2,
  Plus,
  Search,
  Sparkles,
  FileText,
  Users,
  Building2,
  Copy,
  Check,
  Eye,
  X,
  QrCode,
  Share2,
  ChevronDown,
  ChevronUp,
  Handshake,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { TrainingEvent, PartnerItem, UserProfile } from '../types';

interface EventsSectionModuleProps {
  events: TrainingEvent[];
  onToggleRegistration: (eventId: string) => void;
  onAddEvent: (newEvent: TrainingEvent) => void;
  partners: PartnerItem[];
  currentUser: UserProfile;
  totalEarnedCfp: number;
  onSelectPartnerFromEvent?: (companyName: string) => void;
}

export const EventsSectionModule: React.FC<EventsSectionModuleProps> = ({
  events,
  onToggleRegistration,
  onAddEvent,
  partners,
  currentUser,
  totalEarnedCfp,
  onSelectPartnerFromEvent,
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'PRESENZA' | 'WEBINAR' | 'ISCRITTO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>('ev-01');
  const [selectedPosterEvent, setSelectedPosterEvent] = useState<TrainingEvent | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state per Nuovo Evento (Consiglio Direttivo / Segreteria ANACI BG)
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCodice, setNewCodice] = useState('DM140-BG-2026-13');
  const [newData, setNewData] = useState('');
  const [newOrario, setNewOrario] = useState('14:30 – 18:30');
  const [newModalita, setNewModalita] = useState<TrainingEvent['modalita']>('In Presenza (Via V. Bellini 43, BG)');
  const [newLuogoNome, setNewLuogoNome] = useState('Sala Conferenze Sede Provinciale ANACI Bergamo');
  const [newLuogoIndirizzo, setNewLuogoIndirizzo] = useState('Via Vincenzo Bellini 43, 24129 Bergamo (BG)');
  const [newRelatori, setNewRelatori] = useState('');
  const [newCfp, setNewCfp] = useState(4);
  const [newMateria, setNewMateria] = useState('Area Giuridica & Tecnica (DM 140/2014)');
  const [newCapienza, setNewCapienza] = useState(65);
  const [newLinkIscrizione, setNewLinkIscrizione] = useState('https://formazione.anacibergamo.it/iscrizione/nuovo-evento');
  const [newTemiText, setNewTemiText] = useState(
    'Analisi operativa delle novità normative e giurisprudenziali\nCasi pratici dal Tribunale di Bergamo e confronto col Centro Studi\nTavola rotonda con i Partner Tecnici convenzionati ANACI BG'
  );
  const [newPosterColor, setNewPosterColor] = useState<'GREEN' | 'RED' | 'NAVY' | 'GOLD'>('GREEN');
  const [newPosterImageUrl, setNewPosterImageUrl] = useState('');
  const [selectedSponsorNames, setSelectedSponsorNames] = useState<string[]>([
    'Bergamo Gas e Luce',
    'Duelle Lift',
  ]);

  const filteredEvents = events.filter((ev) => {
    if (filterMode === 'PRESENZA' && ev.modalita === 'Webinar Live ANACI') return false;
    if (filterMode === 'WEBINAR' && ev.modalita !== 'Webinar Live ANACI') return false;
    if (filterMode === 'ISCRITTO' && !ev.iscritto) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.titolo.toLowerCase().includes(q);
      const matchSub = ev.sottotitolo?.toLowerCase().includes(q) ?? false;
      const matchRelatori = ev.relatori.toLowerCase().includes(q);
      const matchLuogo = (ev.luogoNome || ev.modalita).toLowerCase().includes(q);
      const matchTemi = ev.temiTrattati?.some((t) => t.toLowerCase().includes(q)) ?? false;
      const matchSponsor = ev.sponsorsEvento?.some((s) => s.companyName.toLowerCase().includes(q)) ?? false;
      return matchTitle || matchSub || matchRelatori || matchLuogo || matchTemi || matchSponsor;
    }
    return true;
  });

  const handleCopyRegistrationLink = (eventId: string, url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLinkId(eventId);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const toggleSponsorSelection = (companyName: string) => {
    setSelectedSponsorNames((prev) =>
      prev.includes(companyName) ? prev.filter((n) => n !== companyName) : [...prev, companyName]
    );
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newData.trim()) return;

    const chosenSponsors = partners
      .filter((p) => selectedSponsorNames.includes(p.companyName))
      .map((p) => ({
        companyName: p.companyName,
        sector: p.sector,
        logoInitials: p.logoInitials,
        referent: p.referentName || `Tel. ${p.phone}`,
      }));

    const temiArray = newTemiText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const createdEvent: TrainingEvent = {
      id: `ev-custom-${Date.now()}`,
      codice: newCodice.trim() || `DM140-BG-${Date.now().toString().slice(-4)}`,
      titolo: newTitle.trim(),
      sottotitolo: newSubtitle.trim() || 'Evento formativo accreditato ANACI Sede Provinciale di Bergamo',
      tipologiaEvento: newModalita === 'Webinar Live ANACI' ? 'WEBINAR_FORMATIVO' : 'SEMINARIO_SEDE',
      relatori: newRelatori.trim() || 'Centro Studi ANACI Bergamo & Partner Tecnici',
      data: newData.trim(),
      orario: newOrario.trim(),
      modalita: newModalita,
      luogoNome: newLuogoNome.trim(),
      luogoIndirizzo: newLuogoIndirizzo.trim(),
      mappaUrl: `https://maps.google.com/?q=${encodeURIComponent(newLuogoIndirizzo.trim() || 'Bergamo')}`,
      cfp: Number(newCfp) || 3,
      materia: newMateria.trim(),
      iscritto: true,
      postiRimasti: Number(newCapienza) || 50,
      capienzaMassima: Number(newCapienza) || 50,
      locandinaColore: newPosterColor,
      locandinaBadge: `EVENTO UFFICIALE • +${Number(newCfp) || 3} CFP`,
      locandinaImageUrl: newPosterImageUrl.trim() || undefined,
      patrocinio: 'ANACI Sede Provinciale di Bergamo',
      quotaPartecipazione: 'Gratuito per Associati ANACI BG',
      linkIscrizione: newLinkIscrizione.trim() || 'https://formazione.anacibergamo.it/iscrizione',
      temiTrattati: temiArray.length > 0 ? temiArray : ['Aggiornamento normativo e tecnico per Amministratori Condominiali'],
      programmaOrario: [
        { ora: 'Registrazione', intervento: 'Accreditamento partecipanti con Tessera ANACI e benvenuto Sponsor' },
        { ora: 'Sessione Unica', intervento: newTitle.trim() },
        { ora: 'Chiusura Lavori', intervento: 'Dibattito, Question Time e verifica finale crediti DM 140/2014' },
      ],
      sponsorsEvento: chosenSponsors,
    };

    onAddEvent(createdEvent);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  const getPosterGradient = (colore?: TrainingEvent['locandinaColore']) => {
    switch (colore) {
      case 'RED':
        return 'from-[#7A161B] via-[#8B1E24] to-[#4A0D10]';
      case 'NAVY':
        return 'from-[#0A2540] via-[#10375C] to-[#061526]';
      case 'GOLD':
        return 'from-[#004D30] via-[#006840] to-[#0A2540]';
      case 'GREEN':
      default:
        return 'from-[#005A38] via-[#008051] to-[#002B1B]';
    }
  };

  return (
    <div className="space-y-6">
      {/* HERO BANNER SEZIONE EVENTI, CONVEGNI & LOCANDINE */}
      <div className="rounded-xl bg-gradient-to-r from-[#001A10] via-[#003822] to-[#0A2540] text-white p-6 md:p-8 shadow-lg border border-[#008051]/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-[#6EE7B7] mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Calendario Ufficiale Eventi, Convegni & Formazione DM 140/2014
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Eventi, Locandine e Convegni ANACI Bergamo
            </h1>
            <p className="text-sm text-white/85 mt-2 leading-relaxed">
              Consulta le <strong>locandine ufficiali</strong>, i <strong>temi del programma</strong>, il <strong>luogo di svolgimento</strong>, gli{' '}
              <strong>Sponsor convenzionati dell’evento</strong> e procedi all’iscrizione immediata con accreditamento automatico dei crediti formativi{' '}
              <strong>DM 140/2014</strong>.
            </p>
          </div>

          {/* Card Riepilogo Crediti & Pulsante Nuovo Evento */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[210px]">
              <div className="flex items-center justify-between text-xs text-white/75 mb-1">
                <span>Tuoi Crediti DM 140/2014</span>
                <GraduationCap className="w-4 h-4 text-[#6EE7B7]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-white">{totalEarnedCfp}</span>
                <span className="text-xs text-white/70">/ {currentUser.cfpObiettivo || 15} CFP annuali</span>
              </div>
              <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((totalEarnedCfp / (currentUser.cfpObiettivo || 15)) * 100))}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-anaci-primary !bg-[#C23030] hover:!bg-[#A02323] !px-5 !py-3.5 shadow-md flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Pubblica Nuovo Evento
            </button>
          </div>
        </div>
      </div>

      {/* BARRA FILTRI E RICERCA */}
      <div className="card-anaci p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: `Tutti gli Eventi (${events.length})` },
            { id: 'PRESENZA', label: 'In Presenza a Bergamo' },
            { id: 'WEBINAR', label: 'Webinar Live FAD' },
            { id: 'ISCRITTO', label: `Le Mie Iscrizioni (${events.filter((e) => e.iscritto).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as typeof filterMode)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                filterMode === tab.id
                  ? 'bg-[#008051] text-white shadow-sm'
                  : 'bg-[#EFF7F3] text-[#001A10] hover:bg-[#D8EDE3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px] md:w-80">
          <Search className="w-4 h-4 text-[#5F6B65] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per tema, luogo, relatore o sponsor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#D4E4DC] bg-white text-[#001A10] focus:outline-none focus:border-[#008051]"
          />
        </div>
      </div>

      {/* ELENCO SCHEDE EVENTI CON LOCANDINA, DATA, LUOGO, SPONSOR, TEMI E LINK ISCRIZIONE */}
      <div className="space-y-6">
        {filteredEvents.map((ev) => {
          const isScheduleOpen = expandedScheduleId === ev.id;
          const registrationUrl = ev.linkIscrizione || `https://formazione.anacibergamo.it/eventi/${ev.codice}`;

          return (
            <div
              key={ev.id}
              className="card-anaci overflow-hidden border border-[#D4E4DC] hover:border-[#008051] transition-all shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* COLONNA SINISTRA (4/12): LOCANDINA GRAFICA ISTITUZIONALE */}
                <div
                  className={`lg:col-span-4 bg-gradient-to-br ${getPosterGradient(
                    ev.locandinaColore
                  )} text-white p-6 flex flex-col justify-between relative overflow-hidden min-h-[360px]`}
                >
                  {/* Pattern decorativo */}
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
                  <div className="absolute top-12 -left-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

                  {/* Intestazione Locandina */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-white text-[#008051] font-extrabold text-xs flex items-center justify-center shadow">
                          ANACI
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold tracking-widest uppercase text-white">
                            ANACI BERGAMO
                          </p>
                          <p className="text-[9px] text-white/75">Sede Provinciale • Via V. Bellini 43</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-white/15 border border-white/25 text-[10px] font-extrabold uppercase tracking-wider">
                        +{ev.cfp} CFP
                      </span>
                    </div>

                    {ev.locandinaImageUrl && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-white/20 max-h-36">
                        <img
                          src={ev.locandinaImageUrl}
                          alt={ev.titolo}
                          className="w-full h-36 object-cover"
                        />
                      </div>
                    )}

                    <span className="inline-block px-2.5 py-0.5 rounded bg-[#C23030] text-white text-[10px] font-extrabold uppercase tracking-wider mb-2">
                      {ev.locandinaBadge || `EVENTO ACCREDITATO • ${ev.codice}`}
                    </span>

                    <h3 className="text-lg font-extrabold leading-snug text-white mb-2">
                      {ev.titolo}
                    </h3>

                    {ev.sottotitolo && (
                      <p className="text-xs text-white/80 leading-relaxed line-clamp-3 mb-4">
                        {ev.sottotitolo}
                      </p>
                    )}
                  </div>

                  {/* Box Data/Luogo in Locandina + Bottoni Azione Locandina */}
                  <div className="relative z-10 space-y-3 pt-4 border-t border-white/15">
                    <div className="bg-black/25 rounded-lg p-3 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 font-bold text-[#6EE7B7]">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{ev.data}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-[11px]">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-white/70" />
                        <span>{ev.orario}</span>
                      </div>
                      <div className="flex items-start gap-2 text-white/90 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-white/70 mt-0.5" />
                        <span>{ev.luogoNome || ev.modalita}</span>
                      </div>
                    </div>

                    {/* Mini strip Sponsor dentro la locandina */}
                    {ev.sponsorsEvento && ev.sponsorsEvento.length > 0 && (
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-white/70 font-bold mb-1.5">
                          Con il contributo degli Sponsor Convenzionati:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {ev.sponsorsEvento.map((sp, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-white/15 text-white text-[10px] font-bold border border-white/20"
                            >
                              {sp.companyName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedPosterEvent(ev)}
                      className="w-full py-2 px-3 rounded-lg bg-white text-[#001A10] hover:bg-[#EFF7F3] font-extrabold text-xs flex items-center justify-center gap-2 shadow transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#008051]" />
                      Ingrandisci Locandina & Pass QR
                    </button>
                  </div>
                </div>

                {/* COLONNA DESTRA (8/12): DETTAGLI COMPLETI (DATA, LUOGO, TEMI, SPONSOR, LINK ISCRIZIONE) */}
                <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-5 bg-white">
                  <div className="space-y-4">
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#EFF7F3] text-[#008051] font-mono text-xs font-bold border border-[#008051]/20">
                          Cod. {ev.codice}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#0A2540]/10 text-[#0A2540] text-xs font-bold">
                          {ev.materia}
                        </span>
                        {ev.iscritto && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ISCRITTO CONFERMATO
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-bold text-[#5F6B65]">
                        Posti disponibili:{' '}
                        <span className="text-[#C23030] font-extrabold">
                          {ev.postiRimasti}
                          {ev.capienzaMassima ? ` / ${ev.capienzaMassima}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Griglia Data, Luogo & Relatori */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#F9FBFA] p-4 rounded-xl border border-[#E2ECE7]">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A10]">
                          <Calendar className="w-4 h-4 text-[#008051]" />
                          <span>DATA E ORARIO</span>
                        </div>
                        <p className="text-sm font-bold text-[#001A10]">{ev.data}</p>
                        <p className="text-xs text-[#5F6B65]">{ev.orario}</p>
                        {ev.quotaPartecipazione && (
                          <p className="text-[11px] font-semibold text-[#008051] pt-1">
                            • {ev.quotaPartecipazione}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-[#001A10]">
                            <MapPin className="w-4 h-4 text-[#C23030]" />
                            <span>LUOGO DI SVOLGIMENTO</span>
                          </div>
                          {ev.mappaUrl && (
                            <a
                              href={ev.mappaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#008051] hover:underline"
                            >
                              Apri Mappa <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm font-bold text-[#001A10]">{ev.luogoNome || ev.modalita}</p>
                        <p className="text-xs text-[#5F6B65]">
                          {ev.luogoIndirizzo || 'Sede Provinciale ANACI Bergamo — Via Vincenzo Bellini 43'}
                        </p>
                      </div>

                      <div className="md:col-span-2 pt-2 border-t border-[#E2ECE7] flex items-start gap-2">
                        <Users className="w-4 h-4 text-[#008051] shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-extrabold text-[#001A10]">Relatori e Interventi: </span>
                          <span className="text-[#374151] font-medium">{ev.relatori}</span>
                        </div>
                      </div>
                    </div>

                    {/* TEMI PRINCIPALI DELL'EVENTO */}
                    {ev.temiTrattati && ev.temiTrattati.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#001A10] flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-[#008051]" />
                            Temi Principali e Argomenti in Programma
                          </h4>
                          {ev.programmaOrario && ev.programmaOrario.length > 0 && (
                            <button
                              onClick={() => setExpandedScheduleId(isScheduleOpen ? null : ev.id)}
                              className="text-xs font-bold text-[#008051] hover:underline flex items-center gap-1"
                            >
                              {isScheduleOpen ? (
                                <>
                                  Nascondi scaletta oraria <ChevronUp className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  Vedi scaletta oraria ({ev.programmaOrario.length} sessioni){' '}
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {ev.temiTrattati.map((tema, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-[#222529] bg-[#EFF7F3]/60 p-2.5 rounded-lg border border-[#D4E4DC]"
                            >
                              <span className="w-4 h-4 rounded-full bg-[#008051] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{tema}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Scaletta Oraria Espandibile */}
                        {isScheduleOpen && ev.programmaOrario && (
                          <div className="mt-3 p-3.5 rounded-xl bg-[#001A10]/[0.03] border border-[#D4E4DC] space-y-2">
                            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#008051]">
                              Cronoprogramma dei Lavori:
                            </p>
                            <div className="space-y-1.5">
                              {ev.programmaOrario.map((slot, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs py-1 border-b border-gray-200/70 last:border-none"
                                >
                                  <span className="font-mono font-extrabold text-[#0A2540] min-w-[125px] shrink-0">
                                    {slot.ora}
                                  </span>
                                  <span className="text-[#222529]">{slot.intervento}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SPONSOR UFFICIALI DELL'EVENTO */}
                    {ev.sponsorsEvento && ev.sponsorsEvento.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#001A10] flex items-center gap-1.5">
                          <Handshake className="w-3.5 h-3.5 text-[#C23030]" />
                          Sponsor e Partner Tecnici dell’Evento ({ev.sponsorsEvento.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {ev.sponsorsEvento.map((sp, idx) => (
                            <div
                              key={idx}
                              onClick={() => onSelectPartnerFromEvent && onSelectPartnerFromEvent(sp.companyName)}
                              className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#D4E4DC] bg-white hover:border-[#008051] hover:shadow-sm transition-all cursor-pointer group"
                              title="Clicca per consultare la scheda convenzione Partner"
                            >
                              <div className="w-9 h-9 rounded-lg bg-[#008051]/10 text-[#008051] group-hover:bg-[#008051] group-hover:text-white font-extrabold text-xs flex items-center justify-center shrink-0 transition-colors">
                                {sp.logoInitials}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-extrabold text-[#001A10] truncate group-hover:text-[#008051]">
                                  {sp.companyName}
                                </p>
                                <p className="text-[10px] text-[#5F6B65] truncate">{sp.sector}</p>
                                {sp.referent && (
                                  <p className="text-[10px] font-semibold text-[#008051] truncate">{sp.referent}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FOOTER SCHEDA: LINK DI ISCRIZIONE & PRENOTAZIONE 1-CLICK */}
                  <div className="pt-4 border-t border-[#E2ECE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-[#F4F8F6] px-3 py-2 rounded-lg border border-[#D4E4DC] min-w-0 flex-1">
                      <ExternalLink className="w-3.5 h-3.5 text-[#008051] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase font-bold text-[#5F6B65]">Link Diretto di Iscrizione:</p>
                        <a
                          href={registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono font-bold text-[#008051] hover:underline truncate block"
                        >
                          {registrationUrl}
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopyRegistrationLink(ev.id, registrationUrl)}
                        className="px-2.5 py-1 rounded bg-white border border-[#D4E4DC] hover:border-[#008051] text-[11px] font-bold text-[#001A10] flex items-center gap-1 shrink-0"
                        title="Copia link di iscrizione da inviare a colleghi o segreteria"
                      >
                        {copiedLinkId === ev.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#008051]" /> Copiato
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copia Link
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedPosterEvent(ev)}
                        className="btn-anaci-outline !py-2.5 !px-3.5 text-xs flex items-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" />
                        Locandina & QR
                      </button>

                      <button
                        onClick={() => onToggleRegistration(ev.id)}
                        className={`px-5 py-2.5 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm ${
                          ev.iscritto
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-[#008051] hover:bg-[#006840] text-white'
                        }`}
                      >
                        {ev.iscritto ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Iscritto (+{ev.cfp} CFP)
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4" />
                            Iscriviti Ora (+{ev.cfp} CFP)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODALE LOCANDINA INGRANDITA & PASS QR DI ACCREDITAMENTO */}
      {selectedPosterEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D4E4DC] my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-[#001A10] text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6EE7B7]" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Locandina Ufficiale Evento — {selectedPosterEvent.codice}
                </span>
              </div>
              <button
                onClick={() => setSelectedPosterEvent(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenuto Locandina Stampabile */}
            <div
              className={`bg-gradient-to-br ${getPosterGradient(
                selectedPosterEvent.locandinaColore
              )} text-white p-8 space-y-6`}
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-[#6EE7B7]">
                    ANACI — Associazione Nazionale Amministratori Condominiali e Immobiliari
                  </p>
                  <p className="text-sm font-bold text-white">
                    Sede Provinciale di Bergamo • Via Vincenzo Bellini 43, Bergamo
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white text-[#008051] font-extrabold text-sm shadow">
                  +{selectedPosterEvent.cfp} CFP DM 140/2014
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded bg-[#C23030] text-white text-xs font-extrabold uppercase tracking-wider">
                  {selectedPosterEvent.materia}
                </span>
                <h2 className="text-2xl font-extrabold leading-tight">{selectedPosterEvent.titolo}</h2>
                {selectedPosterEvent.sottotitolo && (
                  <p className="text-sm text-white/85 leading-relaxed">{selectedPosterEvent.sottotitolo}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/25 p-4 rounded-xl border border-white/15 text-xs">
                <div>
                  <p className="text-white/60 uppercase font-bold text-[10px]">Data e Orari</p>
                  <p className="text-sm font-extrabold text-[#6EE7B7] mt-0.5">{selectedPosterEvent.data}</p>
                  <p className="text-white/90">{selectedPosterEvent.orario}</p>
                </div>
                <div>
                  <p className="text-white/60 uppercase font-bold text-[10px]">Luogo</p>
                  <p className="text-sm font-extrabold text-white mt-0.5">
                    {selectedPosterEvent.luogoNome || selectedPosterEvent.modalita}
                  </p>
                  <p className="text-white/80">{selectedPosterEvent.luogoIndirizzo}</p>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-white/15">
                  <p className="text-white/60 uppercase font-bold text-[10px]">Relatori</p>
                  <p className="text-white font-semibold mt-0.5">{selectedPosterEvent.relatori}</p>
                </div>
              </div>

              {selectedPosterEvent.temiTrattati && (
                <div className="space-y-1.5">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#6EE7B7]">
                    Temi Principali in Programma:
                  </p>
                  <ul className="space-y-1 text-xs text-white/90 list-disc list-inside">
                    {selectedPosterEvent.temiTrattati.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPosterEvent.sponsorsEvento && selectedPosterEvent.sponsorsEvento.length > 0 && (
                <div className="pt-3 border-t border-white/20">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-white/75 mb-2">
                    Sponsor Ufficiali dell’Evento (ANACI Servizi Integrati S.r.l.):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPosterEvent.sponsorsEvento.map((sp, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-white text-[#001A10] text-xs font-extrabold shadow-sm"
                      >
                        {sp.companyName} ({sp.sector})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Box QR Code & Link Iscrizione */}
              <div className="bg-white text-[#001A10] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-[#001A10] text-white flex items-center justify-center shrink-0">
                    <QrCode className="w-9 h-9 text-[#6EE7B7]" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase text-[#008051]">
                      Iscrizione Online & Check-in Rapido
                    </p>
                    <p className="text-xs font-mono text-[#222529] break-all">
                      {selectedPosterEvent.linkIscrizione ||
                        `https://formazione.anacibergamo.it/eventi/${selectedPosterEvent.codice}`}
                    </p>
                    <p className="text-[11px] text-[#5F6B65] mt-0.5">
                      Associato: <strong>{currentUser.fullName}</strong> (Tessera #{currentUser.codiceAssociato})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onToggleRegistration(selectedPosterEvent.id);
                    setSelectedPosterEvent({
                      ...selectedPosterEvent,
                      iscritto: !selectedPosterEvent.iscritto,
                    });
                  }}
                  className="btn-anaci-primary !py-2.5 !px-4 text-xs shrink-0"
                >
                  {selectedPosterEvent.iscritto ? 'Già Iscritto (Annulla)' : 'Conferma Iscrizione'}
                </button>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#F4F8F6] flex items-center justify-between text-xs">
              <span className="text-[#5F6B65]">
                Segreteria Organizzativa ANACI Bergamo • Tel. 035 4139400
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-[#D4E4DC] bg-white hover:border-[#008051] font-bold text-[#001A10] flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#008051]" />
                  Stampa / Salva PDF Locandina
                </button>
                <button
                  onClick={() => setSelectedPosterEvent(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#001A10] text-white font-bold"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE CREAZIONE NUOVO EVENTO CON LOCANDINA (PER DIRETTIVO / SEGRETERIA) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D4E4DC] my-8">
            <div className="flex items-center justify-between px-6 py-4 bg-[#001A10] text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6EE7B7]" />
                <span className="text-sm font-extrabold uppercase tracking-wider">
                  Pubblica Nuovo Evento & Genera Locandina ANACI Bergamo
                </span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Titolo dell’Evento / Convegno *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Es. Tavola Rotonda Supercondomini e Impianti Termici a Bergamo"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC] focus:outline-none focus:border-[#008051]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Codice Corso / Evento
                  </label>
                  <input
                    type="text"
                    value={newCodice}
                    onChange={(e) => setNewCodice(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#D4E4DC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                  Sottotitolo / Abstract Locandina
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Breve descrizione che apparirà sulla locandina ufficiale..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Data Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={newData}
                    onChange={(e) => setNewData(e.target.value)}
                    placeholder="Es. Giovedì 18 Dicembre 2026"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Orario
                  </label>
                  <input
                    type="text"
                    value={newOrario}
                    onChange={(e) => setNewOrario(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Crediti CFP DM 140/2014
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={newCfp}
                    onChange={(e) => setNewCfp(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Modalità
                  </label>
                  <select
                    value={newModalita}
                    onChange={(e) => setNewModalita(e.target.value as TrainingEvent['modalita'])}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC] bg-white"
                  >
                    <option value="In Presenza (Via V. Bellini 43, BG)">In Presenza (Sede Via V. Bellini 43)</option>
                    <option value="Convegno in Presenza (Bergamo)">Convegno in Presenza (Bergamo)</option>
                    <option value="Webinar Live ANACI">Webinar Live ANACI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Luogo / Sala
                  </label>
                  <input
                    type="text"
                    value={newLuogoNome}
                    onChange={(e) => setNewLuogoNome(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Indirizzo Luogo
                  </label>
                  <input
                    type="text"
                    value={newLuogoIndirizzo}
                    onChange={(e) => setNewLuogoIndirizzo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Relatori
                  </label>
                  <input
                    type="text"
                    value={newRelatori}
                    onChange={(e) => setNewRelatori(e.target.value)}
                    placeholder="Es. Avv. Chiara Belotti • Ing. Paolo Milesi"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Link di Iscrizione Ufficiale
                  </label>
                  <input
                    type="url"
                    value={newLinkIscrizione}
                    onChange={(e) => setNewLinkIscrizione(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#D4E4DC]"
                  />
                </div>
              </div>

              {/* Stile Locandina & URL Immagine opzionale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                    Tema Colore Locandina Istituzionale
                  </label>
                  <select
                    value={newPosterColor}
                    onChange={(e) => setNewPosterColor(e.target.value as typeof newPosterColor)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC] bg-white"
                  >
                    <option value="GREEN">Verde Istituzionale ANACI (#008051)</option>
                    <option value="RED">Bordeaux ANACI (#8B1E24)</option>
                    <option value="NAVY">Blu Navy Istituzionale (#0A2540)</option>
                    <option value="GOLD">Speciale Convegno Plenario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#008051]" />
                    URL Immagine Locandina (Opzionale)
                  </label>
                  <input
                    type="url"
                    value={newPosterImageUrl}
                    onChange={(e) => setNewPosterImageUrl(e.target.value)}
                    placeholder="https://... (lascia vuoto per locandina vettoriale ANACI)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                  />
                </div>
              </div>

              {/* Temi trattati */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1">
                  Temi Trattati (uno per riga)
                </label>
                <textarea
                  rows={3}
                  value={newTemiText}
                  onChange={(e) => setNewTemiText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#D4E4DC]"
                />
              </div>

              {/* Selezione Sponsor dell'Evento tra i 21 Partner ANACI BG */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-[#001A10] mb-1.5">
                  Seleziona gli Sponsor Ufficiali dell’Evento (dalla Directory Convenzioni ANACI BG):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2.5 rounded-xl bg-[#F4F8F6] border border-[#D4E4DC]">
                  {partners.map((p) => {
                    const checked = selectedSponsorNames.includes(p.companyName);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => toggleSponsorSelection(p.companyName)}
                        className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center justify-between ${
                          checked
                            ? 'bg-[#008051] text-white border-[#008051]'
                            : 'bg-white text-[#001A10] border-[#D4E4DC] hover:border-[#008051]'
                        }`}
                      >
                        <span className="truncate">{p.companyName}</span>
                        {checked && <Check className="w-3 h-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2ECE7]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D4E4DC] text-xs font-bold text-[#5F6B65]"
                >
                  Annulla
                </button>
                <button type="submit" className="btn-anaci-primary !py-2.5 !px-5 text-xs">
                  Pubblica Evento & Genera Locandina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
