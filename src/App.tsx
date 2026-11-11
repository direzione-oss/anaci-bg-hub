import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Building2,
  MessageSquareWarning,
  Bot,
  Handshake,
  Calculator,
  BookOpen,
  Bell,
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileText,
  Send,
  ThumbsUp,
  Eye,
  Lock,
  Unlock,
  Plus,
  Copy,
  Check,
  Award,
  Calendar,
  ExternalLink,
  ChevronRight,
  Scale,
  Users,
  Filter,
  Download,
  Info,
  QrCode,
  Vote,
} from 'lucide-react';
import {
  DEMO_USERS,
  INITIAL_PARTNERS,
  INITIAL_SOS_POSTS,
  INITIAL_AI_MESSAGES,
  TRAINING_EVENTS,
  TERRITORIAL_ALERTS,
  STATUTE_ARTICLES,
  DEFAULT_CONDO_QUOTE_INPUT,
  calculateCondoQuote,
} from './data/mockData';
import {
  UserRole,
  PartnerCategoryKey,
  PartnerItem,
  SosTag,
  SosPostItem,
  AiMessage,
  CondoQuoteInput,
} from './types';
import AssemblyVotingModule from './components/AssemblyVotingModule';
import { EventsSectionModule } from './components/EventsSectionModule';

type ActiveSection =
  | 'DASHBOARD'
  | 'EVENTI'
  | 'SOS_CONDOMINIO'
  | 'AI_LEGAL_RAG'
  | 'PARTNERS'
  | 'PREVENTIVO'
  | 'ASSEMBLEA_VOTO'
  | 'STATUTO';

const CATEGORY_LABELS: Record<PartnerCategoryKey | 'ALL', string> = {
  ALL: 'Tutte le Categorie (21)',
  ENERGIA_CALORE: 'Energia, Gas & Contabilizzazione Calore',
  IMPIANTI_SICUREZZA: 'Impianti, Ascensori & Sicurezza',
  PULIZIE_MULTISERVIZI: 'Pulizie, Igiene & Multiservizi',
  STUDIO_FISCO_CREDITI: 'Servizi Studio, Fisco 770 & Crediti',
};

const SOS_TAGS: SosTag[] = [
  'Morosità',
  'Infiltrazioni',
  'Parti Comuni',
  'Superbonus/Bonus Edilizi',
  'Distacchi',
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('anaci_bg_session_v2') === 'authenticated';
    } catch {
      return false;
    }
  });
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [pendingSectionAfterLogin, setPendingSectionAfterLogin] = useState<ActiveSection>('DASHBOARD');

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = sessionStorage.getItem('anaci_bg_role_v2') as UserRole | null;
      return saved && DEMO_USERS[saved] ? saved : 'ASSOCIATO';
    } catch {
      return 'ASSOCIATO';
    }
  });
  const currentUser = DEMO_USERS[currentRole];

  const [activeSection, setActiveSection] = useState<ActiveSection>('DASHBOARD');
  const [logoError, setLogoError] = useState(false);

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    const idClean = loginId.trim().toLowerCase();
    const passClean = loginPassword.trim();

    if (
      (idClean === 'direzione@serrastudio.it' || idClean === 'admin@anacibergamo.it' || idClean === 'admin' || idClean === 'bg-0102') &&
      passClean === 'U26m54jzkcHw@re4'
    ) {
      setCurrentRole('ADMIN');
      setActiveSection(pendingSectionAfterLogin);
      setIsAuthenticated(true);
      setLoginError('');
      try {
        sessionStorage.setItem('anaci_bg_session_v2', 'authenticated');
        sessionStorage.setItem('anaci_bg_role_v2', 'ADMIN');
      } catch {}
      return;
    }

    if (
      (idClean === 'bg-1042' || idClean === 'associato@anacibergamo.it' || idClean === 'marco.locatelli@studiobergamo.it') &&
      (passClean === 'anaci2026' || passClean === 'U26m54jzkcHw@re4')
    ) {
      setCurrentRole('ASSOCIATO');
      setActiveSection(pendingSectionAfterLogin);
      setIsAuthenticated(true);
      setLoginError('');
      try {
        sessionStorage.setItem('anaci_bg_session_v2', 'authenticated');
        sessionStorage.setItem('anaci_bg_role_v2', 'ASSOCIATO');
      } catch {}
      return;
    }

    setLoginError('Accesso negato: credenziali non valide. Inserisci Email/Codice Associato e Password autorizzati.');
  }

  function handleProtectedActionPrompt(targetSection: ActiveSection, sectionLabel: string) {
    setPendingSectionAfterLogin(targetSection);
    setLoginError(`🔒 Per accedere a "${sectionLabel}" è obbligatorio autenticarsi con le proprie credenziali ANACI Bergamo.`);
    const inputEl = document.getElementById('anaci-login-id');
    if (inputEl) inputEl.focus();
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setLoginId('');
    setLoginPassword('');
    setLoginError('');
    try {
      sessionStorage.removeItem('anaci_bg_session_v2');
      sessionStorage.removeItem('anaci_bg_role_v2');
      localStorage.removeItem('anaci_bg_auth');
      localStorage.removeItem('anaci_bg_role');
    } catch {}
  }

  // SOS Condominio State
  const [sosPosts, setSosPosts] = useState<SosPostItem[]>(INITIAL_SOS_POSTS);
  const [selectedSosTag, setSelectedSosTag] = useState<SosTag | 'ALL'>('ALL');
  const [sosSearch, setSosSearch] = useState('');
  const [showNewSosModal, setShowNewSosModal] = useState(false);
  const [newSosTitle, setNewSosTitle] = useState('');
  const [newSosContent, setNewSosContent] = useState('');
  const [newSosTag, setNewSosTag] = useState<SosTag>('Infiltrazioni');
  const [newSosZona, setNewSosZona] = useState('Bergamo Città');
  const [newSosUrgency, setNewSosUrgency] = useState<'NORMALE' | 'ALTA' | 'CRITICA'>('NORMALE');
  const [newSosAnon, setNewSosAnon] = useState(true);
  const [newSosAskCs, setNewSosAskCs] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  // Partners State
  const [partners, setPartners] = useState<PartnerItem[]>(INITIAL_PARTNERS);
  const [partnerCategory, setPartnerCategory] = useState<PartnerCategoryKey | 'ALL'>('ALL');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerZoneFilter, setPartnerZoneFilter] = useState<string>('ALL');
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(null);
  const [callbackSuccessPartnerId, setCallbackSuccessPartnerId] = useState<number | null>(null);

  // AI Legal RAG & Quorum State
  const [aiMessages, setAiMessages] = useState<AiMessage[]>(INITIAL_AI_MESSAGES);
  const [aiInput, setAiInput] = useState('');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);
  const [quorumCondominiTot, setQuorumCondominiTot] = useState(24);
  const [quorumPresenti, setQuorumPresenti] = useState(14);
  const [quorumMillesimiPresenti, setQuorumMillesimiPresenti] = useState(540);
  const [quorumMateria, setQuorumMateria] = useState<
    'ORDINARIA_2CONV' | 'NOMINA_AMM' | 'STRAORDINARIA_NOTEVOLE' | 'INNOVAZIONI_1120' | 'SUPERBONUS_119'
  >('NOMINA_AMM');

  // Preventivo State
  const [quoteInput, setQuoteInput] = useState<CondoQuoteInput>(DEFAULT_CONDO_QUOTE_INPUT);
  const [copiedMandato, setCopiedMandato] = useState(false);

  // Statuto State
  const [statuteSearch, setStatuteSearch] = useState('');
  const [statuteAcknowledged, setStatuteAcknowledged] = useState(true);

  // Eventi Formativi State
  const [events, setEvents] = useState(TRAINING_EVENTS);

  const quoteResult = useMemo(
    () => calculateCondoQuote(quoteInput, currentUser.studioName),
    [quoteInput, currentUser.studioName]
  );

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchCat = partnerCategory === 'ALL' || p.category === partnerCategory;
      const matchZone =
        partnerZoneFilter === 'ALL' || p.zoneCoperte.some((z) => z.includes(partnerZoneFilter));
      const q = partnerSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.companyName.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q) ||
        p.descrizioneServizi.toLowerCase().includes(q) ||
        (p.referentName && p.referentName.toLowerCase().includes(q));
      return matchCat && matchZone && matchSearch;
    });
  }, [partners, partnerCategory, partnerZoneFilter, partnerSearch]);

  const filteredSosPosts = useMemo(() => {
    return sosPosts.filter((post) => {
      const matchTag = selectedSosTag === 'ALL' || post.primaryTag === selectedSosTag;
      const q = sosSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.zonaCondominio.toLowerCase().includes(q) ||
        post.secondaryTags.some((t) => t.toLowerCase().includes(q));
      return matchTag && matchSearch;
    });
  }, [sosPosts, selectedSosTag, sosSearch]);

  const filteredStatute = useMemo(() => {
    const q = statuteSearch.trim().toLowerCase();
    if (!q) return STATUTE_ARTICLES;
    return STATUTE_ARTICLES.filter(
      (a) =>
        a.rubrica.toLowerCase().includes(q) ||
        a.contenutoTesto.toLowerCase().includes(q) ||
        a.etichettaArticolo.toLowerCase().includes(q) ||
        a.paroleChiave.some((k) => k.toLowerCase().includes(q))
    );
  }, [statuteSearch]);

  // Calcolo Quorum Art. 1136 c.c.
  const quorumEvaluation = useMemo(() => {
    const minTeste1Terzo = Math.ceil(quorumCondominiTot / 3);
    const minTesteMaggioranza = Math.floor(quorumCondominiTot / 2) + 1;
    let reqTeste = minTeste1Terzo;
    let reqMillesimi = 334;
    let norma = 'Art. 1136 co. 3 c.c. (Seconda Convocazione Ordinaria)';

    if (quorumMateria === 'NOMINA_AMM' || quorumMateria === 'STRAORDINARIA_NOTEVOLE') {
      reqTeste = Math.floor(quorumPresenti / 2) + 1;
      reqMillesimi = 500;
      norma = 'Art. 1136 co. 2 e 4 c.c. (Maggioranza intervenuti e almeno 500/1000)';
    } else if (quorumMateria === 'INNOVAZIONI_1120') {
      reqTeste = minTesteMaggioranza;
      reqMillesimi = 667;
      norma = 'Art. 1136 co. 5 c.c. (Maggioranza partecipanti al condominio e 2/3 del valore = 667/1000)';
    } else if (quorumMateria === 'SUPERBONUS_119') {
      reqTeste = Math.floor(quorumPresenti / 2) + 1;
      reqMillesimi = 334;
      norma = 'Art. 119 co. 9-bis D.L. 34/2020 (Maggioranza intervenuti e almeno 1/3 del valore = 334/1000)';
    }

    const testeOk = quorumPresenti >= reqTeste;
    const millesimiOk = quorumMillesimiPresenti >= reqMillesimi;
    return {
      valido: testeOk && millesimiOk,
      testeOk,
      millesimiOk,
      reqTeste,
      reqMillesimi,
      norma,
    };
  }, [quorumCondominiTot, quorumPresenti, quorumMillesimiPresenti, quorumMateria]);

  function handleCreateSosPost(e: React.FormEvent) {
    e.preventDefault();
    if (!newSosTitle.trim() || !newSosContent.trim()) return;
    const newPost: SosPostItem = {
      id: `sos-bg-${Date.now()}`,
      authorName: currentUser.fullName,
      authorCode: currentUser.codiceAssociato,
      isAnonymous: newSosAnon,
      anonymousAlias: newSosAnon
        ? `Associato Verificato #BG-Anonimo (${newSosZona})`
        : `${currentUser.fullName} (#${currentUser.codiceAssociato})`,
      title: newSosTitle.trim(),
      content: newSosContent.trim(),
      primaryTag: newSosTag,
      secondaryTags: [newSosTag, newSosZona],
      zonaCondominio: newSosZona,
      urgency: newSosUrgency,
      status: newSosAskCs ? 'IN_ANALISI_CS' : 'APERTO',
      richiedeParereCentroStudi: newSosAskCs,
      viewsCount: 1,
      createdAt: 'Adesso',
      replies: [],
    };
    setSosPosts([newPost, ...sosPosts]);
    setNewSosTitle('');
    setNewSosContent('');
    setShowNewSosModal(false);
  }

  function handleAddSosReply(postId: string) {
    const text = (replyDrafts[postId] || '').trim();
    if (!text) return;
    const isExpert = currentUser.role === 'ESPERTO';
    setSosPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          status: isExpert ? 'RISOLTO' : p.status,
          replies: [
            ...p.replies,
            {
              id: `rep-${Date.now()}`,
              authorName: `${currentUser.fullName} (${currentUser.codiceAssociato})`,
              authorRole: currentUser.role,
              authorBadge: isExpert
                ? 'Parere Ufficiale Centro Studi ANACI BG'
                : currentUser.roleLabel,
              isAnonymous: false,
              isOfficialExpertOpinion: isExpert,
              riferimentiNormativi: isExpert
                ? 'Parere Tecnico-Giuridico Centro Studi ANACI Bergamo'
                : undefined,
              content: text,
              helpfulVotes: 1,
              userHasVoted: true,
              createdAt: 'Adesso',
            },
          ],
        };
      })
    );
    setReplyDrafts((prev) => ({ ...prev, [postId]: '' }));
  }

  function handleVoteReply(postId: string, replyId: string) {
    setSosPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          replies: post.replies.map((r) => {
            if (r.id !== replyId) return r;
            const voted = !!r.userHasVoted;
            return {
              ...r,
              helpfulVotes: voted ? r.helpfulVotes - 1 : r.helpfulVotes + 1,
              userHasVoted: !voted,
            };
          }),
        };
      })
    );
  }

  function handleSendAiQuery(customPrompt?: string) {
    const query = (customPrompt ?? aiInput).trim();
    if (!query) return;

    const userMsg: AiMessage = {
      id: `ai-u-${Date.now()}`,
      sender: 'USER',
      timestamp: 'Adesso',
      content: query,
    };

    const qLower = query.toLowerCase();
    let botContent = '';
    let citedSources = [];
    let suggestedDraft = undefined;

    if (qLower.includes('moros') || qLower.includes('63') || qLower.includes('decreto')) {
      botContent =
        'In tema di **riscossione dei contributi condominiali e morosità (Art. 63 disp. att. c.c. e Art. 1129 co. 9 c.c.)**:\n\n• L’amministratore è tenuto ad agire per la riscossione forzosa delle somme dovute **entro 6 mesi dalla chiusura dell’esercizio** nel quale il credito esigibile è compreso, senza bisogno di autorizzazione assembleare.\n• Per ottenere il **decreto ingiuntivo immediatamente esecutivo (art. 63 co. 1 disp. att. c.c.)** presso il Tribunale di Bergamo occorre depositare il verbale di approvazione del rendiconto/preventivo e lo stato di riparto approvato.\n• Ai sensi del **comma 3**, in caso di mora nel pagamento dei contributi che si sia protratta per un semestre, l’amministratore può sospendere il condomino moroso dalla fruizione dei servizi comuni suscettibili di godimento separato.';
      citedSources = [
        {
          code: 'Art. 63 disp. att. c.c.',
          title: 'Disposizioni per l’attuazione del Codice Civile — Riscossione contributi',
          type: 'CODICE_CIVILE' as const,
          excerpt: 'Per la riscossione dei contributi in base allo stato di ripartizione approvato dall’assemblea, l’amministratore può ottenere decreto di ingiunzione immediatamente esecutivo.',
        },
        {
          code: 'Trib. Bergamo Sez. IV',
          title: 'Orientamento Sez. IV Civile Tribunale di Bergamo — Sospensione servizi',
          type: 'CENTRO_STUDI' as const,
          excerpt: 'Tutela dei diritti primari ex art. 32 Cost. e pre-analisi patrimoniale tramite partner convenzionato Studio TJ.',
        },
      ];
      suggestedDraft = {
        title: 'Diffida e Messa in Mora ex Art. 63 disp. att. c.c.',
        type: 'PEC / Raccomandata A.R.',
        body: `OGGETTO: Condominio [Denominazione] – Sollecito formale e costituzione in mora ex art. 1219 c.c. e preavviso azione ex art. 63 disp. att. c.c.\n\nGent.mo/a Condomino/a,\ndalla verifica contabile alla data odierna risulta uno scoperto a Suo carico pari ad € [Importo] relativo alle quote condominiali deliberate dall'Assemblea.\nAi sensi dell'art. 1129, co. 9, c.c., La invito e diffido a provvedere al saldo entro e non oltre 10 (dieci) giorni dal ricevimento della presente sul c/c intestato al Condominio.\nIn difetto, lo scrivente Amministratore sarà obbligato per legge ad agire senza ulteriore preavviso per il recupero coattivo mediante ricorso per Decreto Ingiuntivo provvisoriamente esecutivo ex art. 63, co. 1, disp. att. c.c., con aggravio di spese legali, oltre alla comunicazione dei dati ai creditori insoddisfatti (co. 2) e alla sospensione dei servizi comuni suscettibili di godimento separato (co. 3).\n\nDistinti saluti.\nL'Amministratore pro-tempore (${currentUser.studioName})`,
      };
    } else if (qLower.includes('lastrico') || qLower.includes('1126') || qLower.includes('infiltraz')) {
      botContent =
        'Per la **ripartizione delle spese di lastrici solari o terrazze a livello di uso esclusivo (Art. 1126 c.c.)**:\n\n• **1/3 della spesa** è a carico dei condomini che hanno l’uso esclusivo del lastrico solare o della terrazza a livello;\n• **2/3 della spesa** sono a carico di tutti i condomini dell’edificio o della parte di questo a cui il lastrico solare serve (criterio dell’asse di proiezione verticale), in proporzione del valore del piano o della porzione di piano di ciascuno.\n• **Esclusioni**: restano a totale carico dell’usuario esclusivo i parapetti, le ringhiere e i danni causati da fatto proprio colposo ex art. 2051 c.c.';
      citedSources = [
        {
          code: 'Art. 1126 c.c.',
          title: 'Codice Civile — Lastrici solari di uso esclusivo',
          type: 'CODICE_CIVILE' as const,
          excerpt: 'Quando l’uso dei lastrici solari o di una parte di essi non è comune a tutti i condomini, quelli che ne hanno l’uso esclusivo sono tenuti a contribuire per un terzo...',
        },
        {
          code: 'Cass. SS.UU. 9449/2016',
          title: 'Corte di Cassazione Sezioni Unite Civili n. 9449/2016',
          type: 'CASSAZIONE' as const,
          excerpt: 'Concorso di responsabilità ex art. 2051 c.c. e criterio di riparto 1/3 e 2/3 ex art. 1126 c.c. per danni da infiltrazioni.',
        },
      ];
      suggestedDraft = {
        title: 'Delibera Assembleare Ripartizione Ripristino Lastrico ex Art. 1126 c.c.',
        type: 'Bozza Punto Verbale Assemblea',
        body: `PUNTO N. [X] O.D.G. – Opere di impermeabilizzazione terrazza a livello e costituzione Fondo Speciale ex art. 1135 n. 4 c.c.\n\nL'Assemblea, esaminata la relazione tecnica e i preventivi acquisiti, delibera con il voto favorevole di n. [X] condomini rappresentanti [X]/1000 di affidare i lavori di rifacimento del manto impermeabile all'impresa [Denominazione] per l'importo complessivo di € [Importo] oltre IVA, costituendo contestualmente il fondo speciale obbligatorio ex art. 1135, co. 1, n. 4 c.c. e ripartendo la spesa ai sensi dell'art. 1126 c.c. (1/3 a carico della proprietà avente l'uso esclusivo e 2/3 a carico delle unità immobiliari sottostanti comprese nella proiezione verticale).`,
      };
    } else {
      botContent =
        `Ho analizzato il tuo quesito relativo a **"${query}"** consultando il Codice Civile (artt. 1117–1139 c.c.), lo Statuto ANACI e il massimario del Centro Studi ANACI Bergamo:\n\n• **Obblighi dell'Amministratore (Art. 1129 e 1130 c.c.)**: ogni determinazione assembleare deve rispettare i termini di convocazione (almeno 5 giorni prima ex art. 66 disp. att. c.c.) e la specifica analitica del compenso (art. 1129 co. 14 c.c.).\n• **Supporto Tecnico ANACI Bergamo**: per verifiche ispettive (DPR 462/01, DPR 162/99, Legionella D.Lgs. 18/2023 o Linee Vita su coperture) puoi attivare direttamente dalla sezione **Partner & Convenzioni** gli enti convenzionati sul territorio di Bergamo.`;
      citedSources = [
        {
          code: 'Artt. 1129-1130 c.c.',
          title: 'Codice Civile — Nomina, revoca ed attribuzioni dell’amministratore',
          type: 'CODICE_CIVILE' as const,
          excerpt: 'Obblighi di trasparenza, tenuta registri (anagrafe, verbali, contabilità) e rendicontazione annuale entro 180 giorni.',
        },
        {
          code: 'Statuto ANACI Art. 2-8',
          title: 'Statuto Nazionale ANACI & Sezione Provinciale di Bergamo',
          type: 'STATUTO_ANACI' as const,
          excerpt: 'Tutela professionale ex L. 4/2013, aggiornamento continuo DM 140/2014 e assistenza Centro Studi.',
        },
      ];
    }

    const botMsg: AiMessage = {
      id: `ai-b-${Date.now() + 1}`,
      sender: 'ASSISTANT',
      timestamp: 'Adesso',
      content: botContent,
      citedSources,
      suggestedDraft,
    };

    setAiMessages((prev) => [...prev, userMsg, botMsg]);
    if (!customPrompt) setAiInput('');
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#EFF7F3] text-[#444444]">
        {/* Top Institutional Bar */}
        <div className="bg-[#001A10] text-white text-xs border-b border-[#009B62]/30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#EFF7F3]">
              <span className="w-2 h-2 rounded-full bg-[#009B62] animate-pulse" />
              ANACI Sezione Provinciale di Bergamo — Via Vincenzo Bellini 43, 24129 Bergamo (BG)
            </span>
            <span className="text-[#EFF7F3]/80">
              Portale Collaborativo Associati, Centro Studi & Partner Convenzionati
            </span>
          </div>
        </div>

        {/* Main Login & Welcome Container */}
        <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Welcome & Quick Actions */}
            <div
              className="lg:col-span-7 rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col justify-between relative overflow-hidden"
              style={{
                backgroundImage: 'linear-gradient(125deg, #008051 0%, #001A10 65%, #0A2540 100%)',
              }}
            >
              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider text-[#6EE7B7]">
                  <ShieldCheck className="w-4 h-4" />
                  ANACI Bergamo Hub • Area Riservata Associati
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
                  La Piattaforma Digitale degli Amministratori Condominiali di Bergamo
                </h1>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
                  Condividi casi complessi, consulta i pareri del <strong>Centro Studi ANACI Bergamo</strong>, utilizza gli strumenti di <strong>Intelligenza Artificiale normativa</strong>, iscriviti agli <strong>Eventi CFP DM 140/2014</strong> e contatta in un clic i <strong>21 Partner Convenzionati</strong>.
                </p>

                {/* Quick Actions */}
                <div className="pt-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#6EE7B7] mb-3">
                    Moduli Riservati agli Associati (Richiede Login):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleProtectedActionPrompt('AI_LEGAL_RAG', 'Chiedi ad ANACI Bot')}
                      className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all group"
                    >
                      <Bot className="w-5 h-5 text-[#6EE7B7] mb-1.5" />
                      <div className="text-xs font-extrabold text-white group-hover:underline flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Chiedi ad ANACI Bot
                      </div>
                      <p className="text-[11px] text-white/75 mt-0.5">
                        Assistente RAG Codice Civile, Cassazione e Quorum
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProtectedActionPrompt('SOS_CONDOMINIO', 'SOS Condominio')}
                      className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all group"
                    >
                      <MessageSquareWarning className="w-5 h-5 text-[#FCA5A5] mb-1.5" />
                      <div className="text-xs font-extrabold text-white group-hover:underline flex items-center gap-1">
                        <Lock className="w-3 h-3" /> SOS Condominio
                      </div>
                      <p className="text-[11px] text-white/75 mt-0.5">
                        Casi critici anonimizzati & Pareri Centro Studi
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProtectedActionPrompt('EVENTI', 'Calendario & Eventi')}
                      className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition-all group"
                    >
                      <Calendar className="w-5 h-5 text-[#FDE047] mb-1.5" />
                      <div className="text-xs font-extrabold text-white group-hover:underline flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Calendario & Eventi
                      </div>
                      <p className="text-[11px] text-white/75 mt-0.5">
                        Locandine, Sponsor, Temi e Crediti DM 140/2014
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-white/75 relative z-10">
                <span>Sede Provinciale: Via Vincenzo Bellini 43 — 24129 Bergamo</span>
                <span>Legge n. 4/2013 • DM 140/2014</span>
              </div>
            </div>

            {/* Right Column: Login Card */}
            <div className="lg:col-span-5 card-anaci p-6 sm:p-8 flex flex-col justify-between border-t-4 border-t-[#008051] shadow-xl bg-white">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#008051]">
                      Autenticazione Obbligatoria Associati & Direttivo
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#001A10] mt-0.5">
                      Accedi ad ANACI BG Hub
                    </h2>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-[#EFF7F3] text-[#008051] flex items-center justify-center font-extrabold text-xs border border-[#008051]/20">
                    ANACI
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-[#C23030] font-semibold">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="anaci-login-id"
                      className="block text-xs font-extrabold uppercase text-[#001A10] mb-1"
                    >
                      Email o Codice Associato ANACI *
                    </label>
                    <input
                      id="anaci-login-id"
                      type="text"
                      required
                      autoComplete="username"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Inserisci Email o Codice Associato..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4E4DC] text-sm text-[#001A10] focus:outline-none focus:border-[#008051]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="anaci-login-password"
                      className="block text-xs font-extrabold uppercase text-[#001A10] mb-1"
                    >
                      Password *
                    </label>
                    <input
                      id="anaci-login-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Inserisci la password..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4E4DC] text-sm text-[#001A10] focus:outline-none focus:border-[#008051]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-anaci-primary !py-3 text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                  >
                    <Lock className="w-4 h-4" />
                    Accedi alla Piattaforma Riservata
                  </button>
                </form>

                <div className="pt-4 border-t border-gray-100">
                  <div className="p-3 rounded-lg bg-[#EFF7F3] border border-[#008051]/20 text-xs text-[#001A10] space-y-1">
                    <div className="font-bold text-[#008051] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Accesso Protetto da Credenziali
                    </div>
                    <p className="text-[11px] text-[#444444] leading-relaxed">
                      La consultazione delle bacheche interne, dei pareri del Centro Studi, dei preventivi ex art. 1129 c.c. e dei recapiti diretti dei fornitori è riservata esclusivamente agli Associati ANACI Bergamo autenticati.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] text-[#5F6B65] flex items-center justify-between">
                <span>Assistenza Segreteria: 035 4139400</span>
                <span>info@anacibergamo.it</span>
              </div>
            </div>
          </div>

          {/* Vetrina Pubblica "I Nostri Partner e Sponsor" (Sola anteprima loghi, richiede login per aprire le schede interne) */}
          <div className="card-anaci p-6 sm:p-8 space-y-5 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#008051]">
                  ANACI Servizi Integrati S.r.l. — Sezione di Bergamo
                </span>
                <h3 className="text-xl font-extrabold text-[#001A10] mt-0.5">
                  I Nostri Partner e Sponsor Ufficiali ({partners.length} Aziende Convenzionate)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleProtectedActionPrompt('PARTNERS', 'Convenzioni & Contatti Partner')}
                className="btn-anaci-outline text-xs py-2.5 px-4 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Lock className="w-3.5 h-3.5 text-[#008051]" />
                <span>Accedi per aprire le convenzioni e i contatti</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {partners.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPartner(p);
                    handleProtectedActionPrompt('PARTNERS', `Scheda Convenzione ${p.companyName}`);
                  }}
                  className="p-3 rounded-xl border border-[#D4E4DC] bg-[#F9FBFA] hover:bg-[#EFF7F3] hover:border-[#008051] transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#008051] text-white font-extrabold text-xs flex items-center justify-center mb-2">
                    {p.logoInitials}
                  </div>
                  <div className="text-xs font-extrabold text-[#001A10] truncate group-hover:text-[#008051]">
                    {p.companyName}
                  </div>
                  <div className="text-[10px] text-[#5F6B65] truncate">{p.sector}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EFF7F3] text-[#444444]">
      {/* TOP BAR ISTITUZIONALE ANACI.IT */}
      <div className="bg-[#001A10] text-white text-xs border-b border-[#009B62]/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#EFF7F3]">
              <span className="w-2 h-2 rounded-full bg-[#009B62] animate-pulse" />
              ANACI Sezione Provinciale di Bergamo — Via Vincenzo Bellini 43, 24129 Bergamo (BG)
            </span>
            <span className="hidden md:inline text-[#B9B9B9]">|</span>
            <a
              href="https://anaci.it/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-[#EFF7F3] hover:text-[#009B62] transition-colors"
            >
              Portale Nazionale anaci.it <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#B9B9B9] hidden sm:inline">Simula Ruolo RBAC:</span>
            <div className="flex items-center bg-[#222529] p-0.5 rounded-[6px] border border-[#008051]/50">
              {(['ASSOCIATO', 'ESPERTO', 'PARTNER', 'ADMIN'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`px-2.5 py-1 rounded-[4px] text-[11px] font-medium transition-all ${
                    currentRole === role
                      ? 'bg-[#008051] text-white shadow-sm'
                      : 'text-[#B9B9B9] hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 rounded-[4px] bg-[#C23030] hover:bg-[#A02323] text-white text-[11px] font-semibold transition-colors"
              title="Torna alla schermata di Login"
            >
              Esci
            </button>
          </div>
        </div>
      </div>

      {/* HEADER PRINCIPALE STILE ANACI.IT (post-52.css: h-90px, Poppins, #444444 -> active #006741, pill #EFF7F380, CTA #008051 -> hover #C23030) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#009B62]/25 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 min-h-[84px] flex items-center justify-between gap-4 py-2">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveSection('DASHBOARD')}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-12 h-14 rounded-[8px] bg-white border border-[#008051]/20 p-1 shadow-sm overflow-hidden">
              {!logoError ? (
                <img
                  src="https://anaci.it/wp-content/uploads/2026/08/Logo-ANACI.png"
                  alt="Logo Ufficiale ANACI"
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#008051] text-white rounded-[6px] font-bold text-xs">
                  <span>ANACI</span>
                  <span className="w-6 h-1 bg-[#C23030] mt-0.5 rounded-full" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#008051]">ANACI</span>
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-[5px] bg-[#EFF7F3] text-[#006741] border border-[#009B62]/30">
                  Bergamo Hub
                </span>
              </div>
              <p className="text-[11px] text-[#444444] font-normal leading-tight mt-0.5 max-w-[270px] sm:max-w-none">
                Associazione Nazionale Amministratori Condominiali e Immobiliari
              </p>
            </div>
          </button>

          {/* Navigation Menu (Stile Elementor Nav Menu di anaci.it) */}
          <nav className="hidden xl:flex items-center gap-1">
            {[
              { id: 'DASHBOARD', label: 'Home & Radar BG', icon: Building2 },
              { id: 'EVENTI', label: 'Eventi & Locandine', icon: Calendar, badge: events.length },
              { id: 'SOS_CONDOMINIO', label: 'SOS Condominio', icon: MessageSquareWarning, badge: sosPosts.length },
              { id: 'AI_LEGAL_RAG', label: 'ANACI Bot & Quorum', icon: Bot },
              { id: 'PARTNERS', label: 'Convenzioni (21)', icon: Handshake },
              { id: 'PREVENTIVO', label: 'Preventivo Art. 1129', icon: Calculator },
              { id: 'ASSEMBLEA_VOTO', label: 'Assemblea & Voto QR', icon: QrCode, badge: 'LIVE' },
              { id: 'STATUTO', label: 'Statuto & L. 4/2013', icon: BookOpen },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-[6px] text-[12.5px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#EFF7F3] text-[#006741] font-semibold border border-[#009B62]/30'
                      : 'text-[#444444] hover:bg-[#EFF7F3]/60 hover:text-[#008051]'
                  }`}
                  style={{ letterSpacing: '-0.5px' }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#008051]' : 'text-[#444444]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#C23030] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Badge & Primary CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#333333]">{currentUser.fullName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EFF7F3] text-[#008051] border border-[#009B62]/30">
                  {currentUser.codiceAssociato}
                </span>
              </div>
              <span className="text-[11px] text-[#444444]">{currentUser.zonaOperativa}</span>
            </div>

            <button
              onClick={() => {
                setActiveSection('SOS_CONDOMINIO');
                setShowNewSosModal(true);
              }}
              className="btn-anaci-primary text-xs sm:text-sm py-2 px-3.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuovo SOS</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Bar */}
        <div className="xl:hidden border-t border-[#009B62]/15 bg-[#EFF7F3]/60 px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {[
              { id: 'DASHBOARD', label: 'Home & Radar', icon: Building2 },
              { id: 'EVENTI', label: 'Eventi & Locandine', icon: Calendar },
              { id: 'SOS_CONDOMINIO', label: 'SOS Condominio', icon: MessageSquareWarning },
              { id: 'AI_LEGAL_RAG', label: 'ANACI Bot IA', icon: Bot },
              { id: 'PARTNERS', label: '21 Convenzioni', icon: Handshake },
              { id: 'PREVENTIVO', label: 'Preventivo 1129', icon: Calculator },
              { id: 'ASSEMBLEA_VOTO', label: 'Assemblea & Voto QR', icon: QrCode },
              { id: 'STATUTO', label: 'Statuto ANACI', icon: BookOpen },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#008051] text-white font-semibold'
                      : 'bg-white text-[#444444] border border-[#009B62]/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
        {/* =====================================================================
            SEZIONE 1: DASHBOARD & RADAR TERRITORIALE BERGAMO
           ===================================================================== */}
        {activeSection === 'DASHBOARD' && (
          <div className="space-y-8">
            {/* HERO BANNER ISPIRATO AD ANACI.IT (linear-gradient(90deg, #008051 0%, #001A10 100%)) */}
            <section
              className="rounded-[12px] text-white p-6 sm:p-10 shadow-anaci-card relative overflow-hidden border border-[#009B62]/30"
              style={{
                backgroundImage: 'linear-gradient(90deg, #008051 0%, #001A10 100%)',
              }}
            >
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-white/15 backdrop-blur-sm text-xs font-medium text-[#EFF7F3] border border-white/20">
                    <ShieldCheck className="w-4 h-4 text-[#EFF7F3]" />
                    <span>Sezione Provinciale di Bergamo • Legge n. 4/2013 & D.M. 140/2014</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-semibold text-white leading-tight">
                    Guidiamo il Patrimonio Condominiale Bergamasco verso un Futuro Sostenibile
                  </h1>
                  <p className="text-sm sm:text-base text-[#EFF7F3]/90 font-normal max-w-2xl leading-relaxed">
                    Benvenuto in <strong>ANACI Bergamo Hub</strong> ({currentUser.studioName}). Accedi al confronto riservato tra colleghi, all’assistente normativo IA del Centro Studi, alle <strong>21 convenzioni ufficiali</strong>, all’<strong>Assemblea Soci con accredito QR Code</strong> e al calcolatore analitico del compenso ex Art. 1129 c.c.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveSection('ASSEMBLEA_VOTO')}
                      className="btn-anaci-white"
                    >
                      <QrCode className="w-4 h-4 text-[#008051]" />
                      <span>Accredito QR & Voto Assemblea Soci</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('PREVENTIVO')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-[#C23030] hover:bg-[#A3242B] text-white font-medium text-sm border-2 border-[#C23030] transition-all"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Calcola Preventivo Art. 1129 c.c.</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('EVENTI')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-white/15 hover:bg-white/25 text-white font-medium text-sm border-2 border-white/40 transition-all"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Eventi, Locandine & CFP</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('PARTNERS')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-white/10 hover:bg-white/20 text-white font-medium text-sm border-2 border-white/30 transition-all"
                      style={{ letterSpacing: '-0.5px' }}
                    >
                      <Handshake className="w-4 h-4" />
                      <span>21 Convenzioni BG</span>
                    </button>
                  </div>
                </div>

                {/* Card Stato Associato & Crediti Formativi DM 140/2014 */}
                <div className="lg:col-span-4 bg-white text-[#444444] rounded-[10px] p-5 shadow-anaci-card border-t-4 border-[#C23030] space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#008051]">
                        Posizione Associativa 2026
                      </span>
                      <h3 className="text-base font-semibold text-[#333333] mt-0.5">
                        {currentUser.fullName}
                      </h3>
                      <p className="text-xs text-[#444444]">{currentUser.roleLabel}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-[6px] bg-[#EFF7F3] text-[#008051] font-mono text-xs font-semibold border border-[#009B62]/30">
                      #{currentUser.codiceAssociato}
                    </span>
                  </div>

                  {currentUser.cfpObiettivo > 0 && (
                    <div className="bg-[#EFF7F3] p-3.5 rounded-[8px] border border-[#009B62]/25 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#333333] flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#008051]" />
                          Crediti D.M. 140/2014
                        </span>
                        <span className="font-mono font-bold text-[#008051] tabular-nums">
                          {currentUser.cfpMaturati} / {currentUser.cfpObiettivo} CFP
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#009B62]/20">
                        <div
                          className="h-full bg-[#008051] rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((currentUser.cfpMaturati / currentUser.cfpObiettivo) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-[11px] text-[#444444]">
                        {currentUser.cfpMaturati >= currentUser.cfpObiettivo
                          ? 'Obbligo formativo annuale ex art. 71-bis disp. att. c.c. assolto.'
                          : `Mancano ${
                              currentUser.cfpObiettivo - currentUser.cfpMaturati
                            } CFP entro l’anno formativo per il bollino ANACI.`}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-xs border-t border-gray-100">
                    <span className="text-[#444444] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#008051]" />
                      Statuto Vigente L. 4/2013
                    </span>
                    <button
                      onClick={() => setActiveSection('STATUTO')}
                      className="font-semibold text-[#C23030] hover:underline flex items-center gap-0.5"
                    >
                      Consulta <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* STRISCIA STATISTICHE ISTITUZIONALI STILE ANACI.IT (border-y 2px #009B6280) */}
            <section className="py-4 px-6 bg-white rounded-[10px] border-y-2 border-[#009B62]/50 shadow-anaci-card grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[8px] bg-[#EFF7F3] text-[#008051] flex items-center justify-center shrink-0">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#008051] tabular-nums">21 Partner</div>
                  <div className="text-xs text-[#444444]">Convenzioni Attive Bergamo</div>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[8px] bg-[#EFF7F3] text-[#008051] flex items-center justify-center shrink-0">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#008051] tabular-nums">{sosPosts.length} Casi</div>
                  <div className="text-xs text-[#444444]">SOS Condominio & Pareri CS</div>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[8px] bg-[#FDF2F2] text-[#C23030] flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#C23030] tabular-nums">3 Allerte</div>
                  <div className="text-xs text-[#444444]">Uniacque, Comune BG & Bandi</div>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[8px] bg-[#EFF7F3] text-[#008051] flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#008051] tabular-nums">Art. 1129 c.c.</div>
                  <div className="text-xs text-[#444444]">Preventivatore Benchmark BG</div>
                </div>
              </div>
            </section>

            {/* 4 CARD NAVIGAZIONE RAPIDA ISPIRATE ALLE CARD SERVIZI DI ANACI.IT */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'SOS_CONDOMINIO' as ActiveSection,
                  title: 'SOS Condominio BG',
                  desc: 'Confronto tra colleghi anche in forma anonima verificata e pareri del Centro Studi ANACI BG.',
                  cta: 'Apri Bacheca SOS',
                  icon: MessageSquareWarning,
                },
                {
                  id: 'PARTNERS' as ActiveSection,
                  title: 'Albo 21 Partner BG',
                  desc: 'Fornitori convenzionati Energia, Ascensori, Antincendio, Linee Vita, Pulizie, 770 e Recupero Crediti.',
                  cta: 'Sfoglia Convenzioni',
                  icon: Handshake,
                },
                {
                  id: 'PREVENTIVO' as ActiveSection,
                  title: 'Preventivo Condominio',
                  desc: 'Calcolo analitico compenso ex Art. 1129 co. 14 c.c. e stima budget ordinario condominiale a Bergamo.',
                  cta: 'Calcola Compenso',
                  icon: Calculator,
                },
                {
                  id: 'AI_LEGAL_RAG' as ActiveSection,
                  title: 'ANACI Bot & Quorum',
                  desc: 'Assistente RAG su Codice Civile, Cassazione, Tribunale di Bergamo e calcolatore Quorum Art. 1136.',
                  cta: 'Avvia Assistente IA',
                  icon: Bot,
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveSection(card.id)}
                    className="card-anaci p-6 flex flex-col items-center text-center justify-between cursor-pointer group hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-[#EFF7F3] border border-[#009B62]/30 flex items-center justify-center text-[#008051] group-hover:bg-[#008051] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#333333]">{card.title}</h3>
                      <p className="text-[13.5px] text-[#444444] leading-relaxed">{card.desc}</p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C23030] group-hover:translate-x-1 transition-transform">
                      {card.cta} <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                );
              })}
            </section>

            {/* RADAR TERRITORIALE BERGAMO & CALENDARIO FORMAZIONE ANACI BG */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Radar Territoriale Bergamo */}
              <div className="lg:col-span-7 card-anaci p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-[8px] bg-[#EFF7F3] text-[#008051] flex items-center justify-center">
                      <Bell className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-[#333333]">
                        Radar Territoriale Bergamo & Provincia
                      </h2>
                      <p className="text-xs text-[#444444]">
                        Allerte reti idriche/termiche, ordinanze comunali e bandi regionali attivi
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-[6px] bg-[#EFF7F3] text-[#008051] text-xs font-semibold">
                    Aggiornato Oggi
                  </span>
                </div>

                <div className="space-y-3">
                  {TERRITORIAL_ALERTS.map((al) => (
                    <div
                      key={al.id}
                      className="p-4 rounded-[8px] bg-[#F6F6F6] border-l-4 border-[#008051] hover:bg-[#EFF7F3]/70 transition-colors space-y-1.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#008051] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C23030]" />
                          {al.ente} • {al.zona}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-[#333333] font-medium border border-gray-200">
                          {al.data}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#333333]">{al.titolo}</h4>
                      <p className="text-xs text-[#444444] leading-relaxed">{al.descrizione}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendario Formazione ANACI BG (D.M. 140/2014) */}
              <div className="lg:col-span-5 card-anaci p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-[8px] bg-[#EFF7F3] text-[#008051] flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-[#333333]">
                        Calendario Eventi & Locandine
                      </h2>
                      <p className="text-xs text-[#444444]">
                        Convegni, sponsor, temi ed eventi D.M. 140/2014
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection('EVENTI')}
                    className="text-xs font-semibold text-[#008051] hover:text-[#C23030] flex items-center gap-1"
                  >
                    Locandine <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {events.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-[8px] border border-[#009B62]/20 bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-[5px] bg-[#EFF7F3] text-[#008051] font-mono text-[11px] font-semibold">
                          +{ev.cfp} CFP • {ev.codice}
                        </span>
                        <span className="text-[11px] font-medium text-[#C23030]">
                          {ev.postiRimasti} posti disp.
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#333333] leading-snug">
                        {ev.titolo}
                      </h4>
                      <p className="text-xs text-[#444444]">
                        {ev.data} ({ev.orario}) • {ev.luogoNome || ev.modalita}
                      </p>
                      <div className="pt-1 flex items-center justify-between">
                        <button
                          onClick={() => setActiveSection('EVENTI')}
                          className="text-[11px] font-semibold text-[#008051] hover:underline truncate max-w-[60%]"
                        >
                          Vedi Locandina, Temi & Sponsor →
                        </button>
                        <button
                          onClick={() =>
                            setEvents((prev) =>
                              prev.map((item) =>
                                item.id === ev.id ? { ...item, iscritto: !item.iscritto } : item
                              )
                            )
                          }
                          className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition-all ${
                            ev.iscritto
                              ? 'bg-[#EFF7F3] text-[#008051] border border-[#008051]'
                              : 'bg-[#008051] text-white hover:bg-[#C23030]'
                          }`}
                        >
                          {ev.iscritto ? '✓ Iscritto' : 'Prenota CFP'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveSection('EVENTI')}
                  className="w-full btn-anaci-outline text-xs py-2.5 flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Apri Sezione Eventi, Locandine, Sponsor & Iscrizioni ({events.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            SEZIONE EVENTI, CONVEGNI, LOCANDINE, SPONSOR & ISCRIZIONI
           ===================================================================== */}
        {activeSection === 'EVENTI' && (
          <EventsSectionModule
            events={events}
            onToggleRegistration={(eventId) =>
              setEvents((prev) =>
                prev.map((item) =>
                  item.id === eventId
                    ? {
                        ...item,
                        iscritto: !item.iscritto,
                        postiRimasti: item.iscritto ? item.postiRimasti + 1 : Math.max(0, item.postiRimasti - 1),
                      }
                    : item
                )
              )
            }
            onAddEvent={(newEv) => setEvents((prev) => [newEv, ...prev])}
            partners={partners}
            currentUser={currentUser}
            totalEarnedCfp={
              currentUser.cfpMaturati +
              events.filter((e) => e.iscritto && e.id !== 'ev-01').reduce((acc, e) => acc + e.cfp, 0)
            }
            onSelectPartnerFromEvent={(companyName) => {
              setPartnerSearch(companyName);
              setPartnerCategory('ALL');
              setActiveSection('PARTNERS');
            }}
          />
        )}

        {/* =====================================================================
            SEZIONE 2: SOS CONDOMINIO (BACHECA COLLEGI & PARERI CENTRO STUDI)
           ===================================================================== */}
        {activeSection === 'SOS_CONDOMINIO' && (
          <div className="space-y-6">
            <div className="card-anaci p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[#008051]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008051] uppercase tracking-wider">
                  <MessageSquareWarning className="w-4 h-4" />
                  Comunità Pratica Riservata ANACI Bergamo
                </div>
                <h1 className="text-2xl font-semibold text-[#333333] mt-1">
                  Bacheca SOS Condominio & Pareri Centro Studi
                </h1>
                <p className="text-sm text-[#444444]">
                  Condividi casi complessi (anche con <strong>Anonimato Garantito</strong> per tutelare la privacy dello stabile) e ricevi il riscontro dei colleghi e degli esperti del Centro Studi ANACI Bergamo.
                </p>
              </div>
              <button
                onClick={() => setShowNewSosModal(true)}
                className="btn-anaci-primary shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Pubblica Quesito SOS</span>
              </button>
            </div>

            {/* Filtri Tag & Ricerca */}
            <div className="card-anaci p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedSosTag('ALL')}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                    selectedSosTag === 'ALL'
                      ? 'bg-[#008051] text-white'
                      : 'bg-[#EFF7F3] text-[#444444] hover:text-[#008051]'
                  }`}
                >
                  Tutti i Casi ({sosPosts.length})
                </button>
                {SOS_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedSosTag(tag)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all ${
                      selectedSosTag === tag
                        ? 'bg-[#008051] text-white'
                        : 'bg-[#EFF7F3] text-[#444444] hover:text-[#008051]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-[#444444] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sosSearch}
                  onChange={(e) => setSosSearch(e.target.value)}
                  placeholder="Cerca per articolo c.c., zona, tema..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-[6px] border border-[#009B62]/30 focus:outline-none focus:border-[#008051]"
                />
              </div>
            </div>

            {/* Elenco Post SOS */}
            <div className="space-y-5">
              {filteredSosPosts.map((post) => (
                <article key={post.id} className="card-anaci p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-[6px] bg-[#008051] text-white text-xs font-semibold">
                        {post.primaryTag}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold ${
                          post.urgency === 'CRITICA'
                            ? 'bg-[#C23030] text-white'
                            : post.urgency === 'ALTA'
                            ? 'bg-[#FDF2F2] text-[#C23030] border border-[#C23030]/30'
                            : 'bg-[#EFF7F3] text-[#008051]'
                        }`}
                      >
                        Urgenza {post.urgency}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[#444444] bg-[#F6F6F6] px-2.5 py-1 rounded-[6px]">
                        <MapPin className="w-3.5 h-3.5 text-[#008051]" />
                        {post.zonaCondominio}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#444444]">
                      <span className="inline-flex items-center gap-1">
                        {post.isAnonymous ? (
                          <Lock className="w-3.5 h-3.5 text-[#008051]" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5 text-[#444444]" />
                        )}
                        <strong>{post.anonymousAlias}</strong>
                      </span>
                      <span>• {post.createdAt}</span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {post.viewsCount}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-[#333333] leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#444444] leading-relaxed">{post.content}</p>

                  {/* Risposte e Pareri Ufficiali Centro Studi */}
                  {post.replies.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      {post.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className={`p-4 rounded-[8px] space-y-2 ${
                            rep.isOfficialExpertOpinion
                              ? 'bg-[#EFF7F3] border-l-4 border-[#008051]'
                              : 'bg-[#F6F6F6] border border-gray-200'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#333333]">
                                {rep.authorName}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  rep.isOfficialExpertOpinion
                                    ? 'bg-[#008051] text-white'
                                    : 'bg-white text-[#444444] border border-gray-200'
                                }`}
                              >
                                {rep.authorBadge}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#444444]">{rep.createdAt}</span>
                          </div>

                          {rep.riferimentiNormativi && (
                            <div className="text-[11px] font-mono text-[#006741] bg-white/80 px-2.5 py-1 rounded border border-[#009B62]/20 inline-block">
                              Rif.: {rep.riferimentiNormativi}
                            </div>
                          )}

                          <p className="text-xs sm:text-sm text-[#333333] leading-relaxed">
                            {rep.content}
                          </p>

                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleVoteReply(post.id, rep.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-xs font-medium transition-all ${
                                rep.userHasVoted
                                  ? 'bg-[#008051] text-white'
                                  : 'bg-white text-[#444444] border border-gray-200 hover:border-[#008051]'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Utile ({rep.helpfulVotes})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Box inserimento risposta */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={replyDrafts[post.id] || ''}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder={
                        currentRole === 'ESPERTO'
                          ? 'Inserisci Parere Ufficiale Centro Studi ANACI BG...'
                          : 'Aggiungi un consiglio operativo o esperienza sul territorio...'
                      }
                      className="flex-1 px-3.5 py-2 text-xs rounded-[6px] border border-[#009B62]/30 focus:outline-none focus:border-[#008051]"
                    />
                    <button
                      onClick={() => handleAddSosReply(post.id)}
                      className="btn-anaci-primary text-xs py-2 px-4"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {currentRole === 'ESPERTO' ? 'Pubblica Parere CS' : 'Rispondi al Collega'}
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            SEZIONE 3: ANACI BOT BERGAMO (AI LEGAL RAG & QUORUM ART. 1136 C.C.)
           ===================================================================== */}
        {activeSection === 'AI_LEGAL_RAG' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Colonna Chat RAG */}
            <div className="lg:col-span-8 card-anaci flex flex-col overflow-hidden">
              <div
                className="p-5 text-white flex items-center justify-between"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #008051 0%, #001A10 100%)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-white/15 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      ANACI Bot Bergamo — Assistente Giuridico RAG
                    </h2>
                    <p className="text-xs text-[#EFF7F3]/90">
                      Codice Civile • Cassazione • Tribunale di Bergamo • Pareri Centro Studi
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-[6px] bg-white/15 text-xs font-mono">
                  RAG Verificato
                </span>
              </div>

              {/* Prompt rapidi */}
              <div className="px-5 py-3 bg-[#EFF7F3] border-b border-[#009B62]/20 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#008051] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Quesiti Rapidi:
                </span>
                {[
                  'Recupero morosità e sospensione servizi ex art. 63 disp. att. c.c.',
                  'Riparto infiltrazioni lastrico solare uso esclusivo art. 1126 c.c.',
                  'Validità incarico e preventivo analitico art. 1129 co. 14 c.c.',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendAiQuery(q)}
                    className="px-2.5 py-1 rounded-[5px] bg-white text-[#444444] hover:text-[#008051] border border-[#009B62]/30 text-xs transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Messaggi */}
              <div className="p-5 space-y-4 max-h-[540px] overflow-y-auto bg-white">
                {aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'USER' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[90%] rounded-[10px] p-4 space-y-3 ${
                        msg.sender === 'USER'
                          ? 'bg-[#008051] text-white'
                          : 'bg-[#EFF7F3] text-[#333333] border border-[#009B62]/25'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[11px] opacity-80">
                        <span className="font-semibold">
                          {msg.sender === 'USER' ? currentUser.fullName : 'ANACI Bot Bergamo'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </div>

                      {msg.citedSources && msg.citedSources.length > 0 && (
                        <div className="pt-2 border-t border-[#009B62]/20 space-y-1.5">
                          <span className="text-[11px] font-semibold text-[#008051] uppercase">
                            Fonti Normative e Giurisprudenziali Citate:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.citedSources.map((src, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-[6px] bg-white border border-[#009B62]/20 text-xs"
                              >
                                <div className="font-mono font-bold text-[#008051]">
                                  {src.code}
                                </div>
                                <div className="font-semibold text-[#333333] text-[11px]">
                                  {src.title}
                                </div>
                                <div className="text-[11px] text-[#444444] mt-0.5">
                                  {src.excerpt}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {msg.suggestedDraft && (
                        <div className="p-3.5 rounded-[8px] bg-white border-l-4 border-[#C23030] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-[#C23030]">
                                {msg.suggestedDraft.type}
                              </span>
                              <h4 className="text-xs font-bold text-[#333333]">
                                {msg.suggestedDraft.title}
                              </h4>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(msg.suggestedDraft!.body);
                                setCopiedDraftId(msg.id);
                                setTimeout(() => setCopiedDraftId(null), 2000);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#EFF7F3] text-[#008051] text-xs font-semibold hover:bg-[#008051] hover:text-white transition-colors"
                            >
                              {copiedDraftId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Copiato
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> Copia Bozza
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="text-[11px] font-mono text-[#444444] whitespace-pre-wrap bg-[#F6F6F6] p-2.5 rounded">
                            {msg.suggestedDraft.body}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Chat */}
              <div className="p-4 bg-[#F6F6F6] border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
                  placeholder="Scrivi un quesito su Codice Civile, riparto spese, morosità o bozze verbali..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-[6px] border border-[#009B62]/30 bg-white focus:outline-none focus:border-[#008051]"
                />
                <button onClick={() => handleSendAiQuery()} className="btn-anaci-primary">
                  <Send className="w-4 h-4" />
                  <span>Chiedi al Bot</span>
                </button>
              </div>
            </div>

            {/* Colonna Calcolatore Quorum Art. 1136 c.c. */}
            <div className="lg:col-span-4 card-anaci p-6 space-y-5 self-start">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[11px] font-semibold uppercase text-[#008051]">
                  Utility Assembleare
                </span>
                <h3 className="text-lg font-semibold text-[#333333]">
                  Verifica Quorum Art. 1136 c.c.
                </h3>
                <p className="text-xs text-[#444444]">
                  Controllo istantaneo doppia maggioranza (teste + millesimi) in 2ª convocazione
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#333333] mb-1">
                    Materia all’Ordine del Giorno
                  </label>
                  <select
                    value={quorumMateria}
                    onChange={(e) => setQuorumMateria(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#009B62]/30 bg-white text-[#333333] font-medium"
                  >
                    <option value="ORDINARIA_2CONV">
                      Delibera Ordinaria 2ª Conv. (1/3 teste + 334 mm)
                    </option>
                    <option value="NOMINA_AMM">
                      Nomina/Revoca Amministratore (Magg. interv. + 500 mm)
                    </option>
                    <option value="STRAORDINARIA_NOTEVOLE">
                      Manutenzione Straordinaria Notevole Entità (500 mm)
                    </option>
                    <option value="INNOVAZIONI_1120">
                      Innovazioni Art. 1120 co. 1 c.c. (Magg. part. + 667 mm)
                    </option>
                    <option value="SUPERBONUS_119">
                      Riqualificazione Energetica / Barriere (334 mm)
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-medium text-[#444444] mb-1">Tot. Condomini</label>
                    <input
                      type="number"
                      min={2}
                      value={quorumCondominiTot}
                      onChange={(e) => setQuorumCondominiTot(Number(e.target.value) || 1)}
                      className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#444444] mb-1">Favorevoli</label>
                    <input
                      type="number"
                      min={1}
                      value={quorumPresenti}
                      onChange={(e) => setQuorumPresenti(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#444444] mb-1">Millesimi Fav.</label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={quorumMillesimiPresenti}
                      onChange={(e) => setQuorumMillesimiPresenti(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 font-mono font-semibold"
                    />
                  </div>
                </div>

                <div
                  className={`p-4 rounded-[8px] border-2 space-y-2 ${
                    quorumEvaluation.valido
                      ? 'bg-[#EFF7F3] border-[#008051] text-[#006741]'
                      : 'bg-[#FDF2F2] border-[#C23030] text-[#C23030]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>
                      {quorumEvaluation.valido
                        ? '✓ QUORUM DELIBERATIVO RAGGIUNTO'
                        : '✕ QUORUM INSUFFICIENTE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#333333] font-medium">{quorumEvaluation.norma}</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <span className="block text-[#444444]">Teste Favorevoli:</span>
                      <strong className="font-mono text-[#333333]">
                        {quorumPresenti} / min. {quorumEvaluation.reqTeste}
                      </strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <span className="block text-[#444444]">Millesimi Favorevoli:</span>
                      <strong className="font-mono text-[#333333]">
                        {quorumMillesimiPresenti} / min. {quorumEvaluation.reqMillesimi}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            SEZIONE 4: ALBO 21 PARTNER & CONVENZIONI UFFICIALI ANACI BERGAMO
           ===================================================================== */}
        {activeSection === 'PARTNERS' && (
          <div className="space-y-6">
            <div className="card-anaci p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-l-[#008051]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008051] uppercase tracking-wider">
                  <Handshake className="w-4 h-4" />
                  ANACI Servizi Integrati S.r.l. — Sezione di Bergamo
                </div>
                <h1 className="text-2xl font-semibold text-[#333333] mt-1">
                  Elenco Ufficiale dei 21 Partner & Convenzioni Territoriali
                </h1>
                <p className="text-sm text-[#444444]">
                  Contatti diretti dei referenti provinciali, numeri verdi dedicati agli studi associati e recensioni verificate sui cantieri e condomini di Bergamo.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#444444] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={partnerSearch}
                    onChange={(e) => setPartnerSearch(e.target.value)}
                    placeholder="Cerca azienda, referente, settore..."
                    className="pl-9 pr-3 py-2 text-xs rounded-[6px] border border-[#009B62]/30 bg-white focus:outline-none focus:border-[#008051] min-w-[230px]"
                  />
                </div>
                <select
                  value={partnerZoneFilter}
                  onChange={(e) => setPartnerZoneFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-[6px] border border-[#009B62]/30 bg-white font-medium text-[#333333]"
                >
                  <option value="ALL">Tutte le Zone di Bergamo</option>
                  <option value="Bergamo Città">Bergamo Città</option>
                  <option value="Città Alta">Città Alta</option>
                  <option value="Val Seriana">Val Seriana</option>
                  <option value="Val Brembana">Val Brembana</option>
                  <option value="Isola Bergamasca">Isola Bergamasca</option>
                  <option value="Bassa Bergamasca">Bassa Bergamasca</option>
                </select>
              </div>
            </div>

            {/* Tabs Categorie */}
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'ENERGIA_CALORE', 'IMPIANTI_SICUREZZA', 'PULIZIE_MULTISERVIZI', 'STUDIO_FISCO_CREDITI'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setPartnerCategory(cat)}
                    className={`px-4 py-2 rounded-[6px] text-xs font-semibold transition-all ${
                      partnerCategory === cat
                        ? 'bg-[#008051] text-white shadow-sm'
                        : 'bg-white text-[#444444] border border-[#009B62]/25 hover:border-[#008051] hover:text-[#008051]'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                )
              )}
            </div>

            {/* Griglia 21 Partner in stile Card ANACI.IT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="card-anaci p-6 flex flex-col justify-between space-y-4 hover:border-[#008051] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[8px] bg-[#008051] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                          {partner.logoInitials}
                        </div>
                        <div>
                          <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#EFF7F3] text-[#008051] border border-[#009B62]/30">
                            {partner.sector}
                          </span>
                          <h3 className="text-lg font-semibold text-[#333333] leading-tight mt-0.5">
                            {partner.companyName}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#EFF7F3] px-2 py-1 rounded-[6px] text-xs font-bold text-[#008051] tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#008051] text-[#008051]" />
                        {partner.ratingMedio.toFixed(1)}
                      </div>
                    </div>

                    <p className="text-xs text-[#444444] leading-relaxed">
                      {partner.descrizioneServizi}
                    </p>

                    <div className="p-3 rounded-[8px] bg-[#EFF7F3] border border-[#009B62]/25 text-xs space-y-1">
                      <div className="font-semibold text-[#006741] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008051]" />
                        Vantaggio Riservato Associati ANACI BG:
                      </div>
                      <p className="text-[11.5px] text-[#444444] leading-snug">
                        {partner.vantaggiAssociati}
                      </p>
                    </div>

                    {/* Contatti Ufficiali Verificati */}
                    <div className="pt-1 space-y-1.5 text-xs">
                      {partner.referentName && (
                        <div className="flex items-center gap-2 text-[#333333] font-medium">
                          <Users className="w-3.5 h-3.5 text-[#008051]" />
                          <span>
                            Referente: <strong>{partner.referentName}</strong>
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[#333333]">
                        <Phone className="w-3.5 h-3.5 text-[#008051]" />
                        <a
                          href={`tel:${partner.phone.replace(/\s+/g, '')}`}
                          className="font-mono font-semibold text-[#008051] hover:underline"
                        >
                          {partner.phone}
                        </a>
                      </div>
                      {partner.email && (
                        <div className="flex items-center gap-2 text-[#444444] truncate">
                          <Mail className="w-3.5 h-3.5 text-[#C23030] shrink-0" />
                          <a
                            href={`mailto:${partner.email}`}
                            className="hover:text-[#008051] hover:underline truncate"
                          >
                            {partner.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedPartner(partner)}
                      className="text-xs font-semibold text-[#008051] hover:text-[#C23030] transition-colors"
                    >
                      Recensioni ({partner.totaleRecensioni}) & Dettagli
                    </button>
                    <button
                      onClick={() => {
                        setCallbackSuccessPartnerId(partner.id);
                        setTimeout(() => setCallbackSuccessPartnerId(null), 3000);
                      }}
                      className="btn-anaci-primary text-xs py-1.5 px-3"
                    >
                      {callbackSuccessPartnerId === partner.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Richiesta Inviata
                        </>
                      ) : (
                        <>Richiedi Sopralluogo</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            SEZIONE 5: CALCOLATORE PREVENTIVO COMPENSO ART. 1129 C.C.
           ===================================================================== */}
        {activeSection === 'PREVENTIVO' && (
          <div className="space-y-6">
            <div className="card-anaci p-6 border-l-4 border-l-[#008051]">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008051] uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                Art. 1129 comma 14 Codice Civile • Benchmark Bergamo e Provincia
              </div>
              <h1 className="text-2xl font-semibold text-[#333333] mt-1">
                Calcolatore Preventivo Gestione Condominio & Proposta di Mandato
              </h1>
              <p className="text-sm text-[#444444]">
                Elabora il preventivo analitico obbligatorio all’atto dell’accettazione della nomina o del rinnovo (pena la nullità ex art. 1129 co. 14 c.c.) e stima la rata media mensile ordinaria dello stabile.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Parametri Condominio */}
              <div className="lg:col-span-5 card-anaci p-6 space-y-4 self-start">
                <h3 className="text-base font-semibold text-[#333333] border-b border-gray-100 pb-2">
                  1. Dati e Consistenza dello Stabile
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#333333] mb-1">
                      Denominazione Condominio
                    </label>
                    <input
                      type="text"
                      value={quoteInput.condominioNome}
                      onChange={(e) =>
                        setQuoteInput({ ...quoteInput, condominioNome: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-[6px] border border-[#009B62]/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#333333] mb-1">
                        Indirizzo / Comune
                      </label>
                      <input
                        type="text"
                        value={quoteInput.indirizzoCondominio}
                        onChange={(e) =>
                          setQuoteInput({ ...quoteInput, indirizzoCondominio: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-[6px] border border-[#009B62]/30"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#333333] mb-1">
                        Zona Territoriale BG
                      </label>
                      <select
                        value={quoteInput.zona}
                        onChange={(e) => setQuoteInput({ ...quoteInput, zona: e.target.value })}
                        className="w-full px-3 py-2 rounded-[6px] border border-[#009B62]/30 bg-white"
                      >
                        <option value="Bergamo Città">Bergamo Città</option>
                        <option value="Città Alta">Città Alta (Centro Storico)</option>
                        <option value="Isola Bergamasca">Isola Bergamasca</option>
                        <option value="Val Seriana">Val Seriana</option>
                        <option value="Val Brembana">Val Brembana</option>
                        <option value="Bassa Bergamasca">Bassa Bergamasca</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div>
                      <label className="block font-semibold text-[#333333] mb-1">
                        Unità Principali
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={300}
                        value={quoteInput.unitaPrincipali}
                        onChange={(e) =>
                          setQuoteInput({
                            ...quoteInput,
                            unitaPrincipali: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 font-mono font-bold text-[#008051]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#333333] mb-1">
                        Pertinenze/Box
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={400}
                        value={quoteInput.pertinenzeBoxCantine}
                        onChange={(e) =>
                          setQuoteInput({
                            ...quoteInput,
                            pertinenzeBoxCantine: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#333333] mb-1">
                        N. Scale
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={quoteInput.scalePalazzine}
                        onChange={(e) =>
                          setQuoteInput({
                            ...quoteInput,
                            scalePalazzine: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#333333] mb-1">
                        N. Ascensori
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={quoteInput.numAscensori}
                        onChange={(e) =>
                          setQuoteInput({
                            ...quoteInput,
                            numAscensori: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <span className="block font-semibold text-[#333333]">
                      2. Impianti e Complessità Gestionale
                    </span>
                    {[
                      {
                        key: 'riscaldamentoCentralizzato',
                        label: 'Impianto di Riscaldamento Centralizzato (Terzo Responsabile)',
                      },
                      {
                        key: 'contabilizzazioneCaloreUni10200',
                        label: 'Riparto Contabilizzazione Calore e ACS (Norma UNI 10200)',
                      },
                      {
                        key: 'areaVerdeCondominiale',
                        label: 'Parco / Giardino Condominiale e Potature',
                      },
                      {
                        key: 'portineriaCustode',
                        label: 'Servizio di Portineria / Custode (CCNL Proprietari Fabbricati)',
                      },
                      {
                        key: 'supercondominio',
                        label: 'Gestione Supercondominio (Art. 1117-bis c.c.)',
                      },
                      {
                        key: 'includiPassaggioConsegne',
                        label: 'Includi Una Tantum Subentro e Allineamento Contabile Iniziale',
                      },
                    ].map((chk) => (
                      <label
                        key={chk.key}
                        className="flex items-center gap-2.5 p-2 rounded-[6px] bg-[#EFF7F3]/60 hover:bg-[#EFF7F3] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(quoteInput as any)[chk.key]}
                          onChange={(e) =>
                            setQuoteInput({ ...quoteInput, [chk.key]: e.target.checked })
                          }
                          className="rounded text-[#008051] focus:ring-[#008051]"
                        />
                        <span className="text-[#333333] font-medium">{chk.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block font-semibold text-[#333333] mb-1">
                      3. Regime Fiscale dello Studio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setQuoteInput({ ...quoteInput, regimeFiscale: 'ORDINARIO_IVA' })
                        }
                        className={`py-2 px-3 rounded-[6px] font-semibold border text-xs ${
                          quoteInput.regimeFiscale === 'ORDINARIO_IVA'
                            ? 'bg-[#008051] text-white border-[#008051]'
                            : 'bg-white text-[#444444] border-gray-200'
                        }`}
                      >
                        Ordinario (Cassa 4% + IVA 22%)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setQuoteInput({ ...quoteInput, regimeFiscale: 'FORFETTARIO_ESENTE' })
                        }
                        className={`py-2 px-3 rounded-[6px] font-semibold border text-xs ${
                          quoteInput.regimeFiscale === 'FORFETTARIO_ESENTE'
                            ? 'bg-[#008051] text-white border-[#008051]'
                            : 'bg-white text-[#444444] border-gray-200'
                        }`}
                      >
                        Forfettario (Esente IVA)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prospetto Risultati & Proposta Mandato Art. 1129 */}
              <div className="lg:col-span-7 space-y-6">
                {/* KPI Cards Preventivo */}
                <div
                  className="rounded-[10px] p-6 text-white shadow-anaci-card grid grid-cols-1 sm:grid-cols-3 gap-4"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #008051 0%, #001A10 100%)',
                  }}
                >
                  <div>
                    <span className="text-xs text-[#EFF7F3]/80">Imponibile Annuo Studio</span>
                    <div className="text-2xl font-bold font-mono tabular-nums mt-0.5">
                      € {quoteResult.totaleImponibileStudio.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-[#EFF7F3]/80">
                      Oltre Cassa ({quoteInput.cassaPrevidenzialePct}%) e IVA
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#EFF7F3]/80">Totale Lordo Omnicomprensivo</span>
                    <div className="text-2xl font-bold font-mono tabular-nums mt-0.5 text-[#FFBC7D]">
                      € {quoteResult.totaleLordoAnnuoStudio.toFixed(2)}
                    </div>
                    <span className="text-[11px] text-[#EFF7F3]/80">
                      N. {quoteResult.numeroPreventivo}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#EFF7F3]/80">Incidenza Compenso / Unità</span>
                    <div className="text-2xl font-bold font-mono tabular-nums mt-0.5">
                      € {quoteResult.costoMensileStudioPerUnita.toFixed(2)}
                      <span className="text-xs font-normal"> /mese</span>
                    </div>
                    <span className="text-[11px] text-[#EFF7F3]/80">
                      Su {quoteInput.unitaPrincipali} u.i. principali
                    </span>
                  </div>
                </div>

                {/* Tabella Voci Analitiche */}
                <div className="card-anaci p-6 space-y-4">
                  <h3 className="text-base font-semibold text-[#333333]">
                    Dettaglio Voci Analitiche del Compenso (Art. 1129 co. 14 c.c.)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b-2 border-[#008051]/30 text-[#008051]">
                          <th className="py-2 pr-2">Voce / Riferimento Normativo</th>
                          <th className="py-2 px-2 text-right">Q.tà</th>
                          <th className="py-2 px-2 text-right">Unitario</th>
                          <th className="py-2 pl-2 text-right">Totale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {quoteResult.vociAnalitiche.map((v) => (
                          <tr key={v.codice} className="hover:bg-[#EFF7F3]/50">
                            <td className="py-2.5 pr-2">
                              <div className="font-semibold text-[#333333]">{v.descrizione}</div>
                              <div className="text-[10px] font-mono text-[#008051]">
                                {v.riferimentoNormativo}
                              </div>
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                              {v.quantita}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                              € {v.importoUnitario.toFixed(2)}
                            </td>
                            <td className="py-2.5 pl-2 text-right font-mono font-semibold text-[#333333] tabular-nums">
                              € {v.totaleVoce.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Stima Budget Ordinario Condominiale Bergamo */}
                  <div className="p-4 rounded-[8px] bg-[#EFF7F3] border border-[#009B62]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#008051] uppercase">
                        Benchmark Bilancio Preventivo Ordinario Stabile (Bergamo)
                      </span>
                      <p className="text-xs text-[#444444]">
                        Stima complessiva annua (Pulizie, Luce/Acqua, Polizza Fabbricato, Ascensori, Riscaldamento e Amministrazione):{' '}
                        <strong className="font-mono text-[#333333]">
                          € {quoteResult.stimaBudgetCondominio.totaleBudgetOrdinarioAnnuo.toLocaleString('it-IT')} / anno
                        </strong>
                      </p>
                    </div>
                    <div className="bg-white px-3.5 py-2 rounded-[6px] border border-[#008051]/30 text-right shrink-0">
                      <span className="block text-[10px] text-[#444444]">Rata Media Stimata</span>
                      <strong className="font-mono text-base text-[#008051]">
                        ~ € {quoteResult.stimaBudgetCondominio.rataMediaMensilePerUnita} / mese
                      </strong>
                    </div>
                  </div>

                  {/* Testo Proposta di Mandato copiabile */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#333333]">
                        Testo Proposta di Mandato Professionale pronta per Assemblea:
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(quoteResult.testoPropostaMandatoArt1129);
                          setCopiedMandato(true);
                          setTimeout(() => setCopiedMandato(false), 2000);
                        }}
                        className="btn-anaci-primary text-xs py-1.5 px-3"
                      >
                        {copiedMandato ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Testo Copiato
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copia Proposta Art. 1129
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 rounded-[8px] bg-[#F6F6F6] border border-gray-200 text-[11px] font-mono text-[#333333] whitespace-pre-wrap leading-relaxed">
                      {quoteResult.testoPropostaMandatoArt1129}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            SEZIONE 6: STATUTO ANACI & ORDINAMENTO SEZIONE DI BERGAMO
           ===================================================================== */}
        {activeSection === 'STATUTO' && (
          <div className="space-y-6">
            <div className="card-anaci p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-l-[#008051]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#008051] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  Documentazione Istituzionale Ufficiale • Legge 14 Gennaio 2013, n. 4
                </div>
                <h1 className="text-2xl font-semibold text-[#333333] mt-1">
                  Statuto Nazionale ANACI e Ordinamento Sezione Provinciale di Bergamo
                </h1>
                <p className="text-sm text-[#444444]">
                  Consultazione interattiva degli articoli statutari, requisiti di ammissione ex art. 71-bis disp. att. c.c., organi territoriali e Sportello del Consumatore.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setStatuteAcknowledged(true)}
                  className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 border ${
                    statuteAcknowledged
                      ? 'bg-[#EFF7F3] text-[#008051] border-[#008051]'
                      : 'bg-[#008051] text-white border-[#008051]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {statuteAcknowledged
                      ? 'Presa Visione Registrata (#BG-2026)'
                      : 'Conferma Presa Visione'}
                  </span>
                </button>
              </div>
            </div>

            <div className="card-anaci p-4 flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#444444] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={statuteSearch}
                  onChange={(e) => setStatuteSearch(e.target.value)}
                  placeholder="Cerca nello Statuto (es. 15 CFP, art. 71-bis, Sportello Consumatore, Assemblea Provinciale)..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-[6px] border border-[#009B62]/30 focus:outline-none focus:border-[#008051]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredStatute.map((art) => (
                <div key={art.id} className="card-anaci p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-[6px] bg-[#008051] text-white font-mono text-xs font-bold">
                      {art.etichettaArticolo}
                    </span>
                    <span className="text-[11px] font-semibold text-[#006741] bg-[#EFF7F3] px-2.5 py-1 rounded-[6px]">
                      {art.titoloSezione}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#333333]">{art.rubrica}</h3>
                  <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                    {art.contenutoTesto}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {art.paroleChiave.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#F6F6F6] text-[#444444] border border-gray-200"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            SEZIONE 6: ASSEMBLEA SOCI, ACCREDITO QR (INGRESSO / ONLINE) & VOTO
           ===================================================================== */}
        {activeSection === 'ASSEMBLEA_VOTO' && (
          <AssemblyVotingModule currentUser={currentUser} />
        )}
      </main>

      {/* MODALE NUOVO QUESITO SOS */}
      {showNewSosModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[10px] shadow-anaci-popup max-w-xl w-full p-6 space-y-4 border-t-4 border-[#008051]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#333333]">
                Pubblica Nuovo Quesito SOS Condominio
              </h3>
              <button
                onClick={() => setShowNewSosModal(false)}
                className="text-xs font-semibold text-[#444444] hover:text-[#C23030]"
              >
                Chiudi ✕
              </button>
            </div>

            <form onSubmit={handleCreateSosPost} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#333333] mb-1">
                  Oggetto / Problematica Condominiale
                </label>
                <input
                  type="text"
                  required
                  value={newSosTitle}
                  onChange={(e) => setNewSosTitle(e.target.value)}
                  placeholder="Es. Riparto spese rifacimento cortile sopra autorimessa interrata..."
                  className="w-full px-3 py-2 rounded-[6px] border border-[#009B62]/30"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-[#333333] mb-1">Categoria</label>
                  <select
                    value={newSosTag}
                    onChange={(e) => setNewSosTag(e.target.value as SosTag)}
                    className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 bg-white"
                  >
                    {SOS_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#333333] mb-1">Zona Bergamo</label>
                  <input
                    type="text"
                    value={newSosZona}
                    onChange={(e) => setNewSosZona(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#333333] mb-1">Urgenza</label>
                  <select
                    value={newSosUrgency}
                    onChange={(e) => setNewSosUrgency(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-[6px] border border-[#009B62]/30 bg-white"
                  >
                    <option value="NORMALE">NORMALE</option>
                    <option value="ALTA">ALTA</option>
                    <option value="CRITICA">CRITICA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#333333] mb-1">
                  Descrizione del Caso
                </label>
                <textarea
                  rows={4}
                  required
                  value={newSosContent}
                  onChange={(e) => setNewSosContent(e.target.value)}
                  placeholder="Descrivi i dettagli tecnici o giuridici senza inserire nomi di condomini..."
                  className="w-full px-3 py-2 rounded-[6px] border border-[#009B62]/30"
                />
              </div>

              <div className="p-3 rounded-[8px] bg-[#EFF7F3] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSosAnon}
                    onChange={(e) => setNewSosAnon(e.target.checked)}
                    className="rounded text-[#008051]"
                  />
                  <span className="font-semibold text-[#006741]">
                    Attiva Anonimato Garantito (mostra solo &ldquo;Associato Verificato #BG-Anonimo&rdquo;)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSosAskCs}
                    onChange={(e) => setNewSosAskCs(e.target.checked)}
                    className="rounded text-[#008051]"
                  />
                  <span className="font-medium text-[#333333]">
                    Richiedi Parere Ufficiale al Centro Studi ANACI Bergamo
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSosModal(false)}
                  className="btn-anaci-outline text-xs"
                >
                  Annulla
                </button>
                <button type="submit" className="btn-anaci-primary text-xs">
                  Pubblica in Bacheca SOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DETTAGLIO PARTNER */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[10px] shadow-anaci-popup max-w-xl w-full p-6 space-y-4 border-t-4 border-[#008051]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#008051] uppercase">
                  {selectedPartner.categoryLabel}
                </span>
                <h3 className="text-xl font-semibold text-[#333333]">
                  {selectedPartner.companyName}
                </h3>
                <p className="text-xs text-[#444444]">{selectedPartner.badgeConvenzione}</p>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-xs font-semibold text-[#444444] hover:text-[#C23030]"
              >
                Chiudi ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
              {selectedPartner.descrizioneServizi}
            </p>

            <div className="p-3.5 rounded-[8px] bg-[#EFF7F3] border border-[#009B62]/30 text-xs space-y-1">
              <strong className="text-[#008051] block">Condizioni Convenzione ANACI Bergamo:</strong>
              <p className="text-[#333333]">{selectedPartner.vantaggiAssociati}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-[#333333]">
                Recensioni Colleghi Associati ANACI BG ({selectedPartner.reviews.length})
              </h4>
              {selectedPartner.reviews.map((r) => (
                <div key={r.id} className="p-3 rounded-[8px] bg-[#F6F6F6] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#008051]">{r.authorAlias}</strong>
                    <span className="text-[11px] text-[#444444]">
                      {r.zonaCondominio} • {r.date}
                    </span>
                  </div>
                  <div className="font-medium text-[#333333]">Intervento: {r.intervento}</div>
                  <p className="text-[#444444] italic">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER SCURO ISTITUZIONALE STILE ANACI.IT (post-42.css: bg #222529, text #B9B9B9, icone stacked #008051, hover #008051) */}
      <footer className="bg-[#222529] text-[#B9B9B9] mt-12 border-t-4 border-[#008051]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-[6px] bg-[#008051] text-white font-bold text-sm">
                ANACI
              </span>
              <span className="text-white font-semibold text-sm">
                Sezione Provinciale di Bergamo
              </span>
            </div>
            <p className="leading-relaxed text-[#B9B9B9]">
              Associazione Nazionale Amministratori Condominiali e Immobiliari (Legge 14 gennaio 2013, n. 4). La più grande associazione nazionale che raggruppa oltre 7.000 amministratori professionisti.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm mb-2">Sede Provinciale Bergamo</h4>
            <p className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#008051] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span>Via Vincenzo Bellini 43, 24129 Bergamo (BG)</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#008051] text-white flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <a href="mailto:info@anacibergamo.it" className="hover:text-[#008051] transition-colors">
                info@anacibergamo.it
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm mb-2">Moduli Piattaforma</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveSection('SOS_CONDOMINIO')}
                  className="hover:text-[#008051] transition-colors"
                >
                  → Bacheca SOS Condominio & Centro Studi
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('PARTNERS')}
                  className="hover:text-[#008051] transition-colors"
                >
                  → Albo 21 Partner & Convenzioni Bergamo
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('PREVENTIVO')}
                  className="hover:text-[#008051] transition-colors"
                >
                  → Calcolatore Preventivo Art. 1129 c.c.
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('ASSEMBLEA_VOTO')}
                  className="hover:text-[#008051] transition-colors"
                >
                  → Assemblea Soci, Accredito QR & Votazioni
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('STATUTO')}
                  className="hover:text-[#008051] transition-colors"
                >
                  → Statuto Vigente & Legge 4/2013
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-semibold text-sm mb-2">Design System Ufficiale</h4>
            <p className="leading-relaxed">
              Grafica, palette cromatica (<code className="text-white">#008051</code> Verde ANACI,{' '}
              <code className="text-white">#C23030</code> Rosso ANACI,{' '}
              <code className="text-white">#EFF7F3</code> Soft Mint,{' '}
              <code className="text-white">#222529</code> Dark Footer) e tipografia{' '}
              <strong className="text-white">Poppins</strong> allineate al portale nazionale{' '}
              <a
                href="https://anaci.it/"
                target="_blank"
                rel="noreferrer"
                className="text-white underline hover:text-[#008051]"
              >
                anaci.it
              </a>
              .
            </p>
          </div>
        </div>

        <div className="border-t border-[#444444] py-4 px-4 sm:px-8 text-center text-[11px] text-[#B9B9B9]">
          © 2026 ANACI Sezione Provinciale di Bergamo — Tutti i diritti riservati • Conforme a Legge n. 4/2013 e D.M. 140/2014
        </div>
      </footer>
    </div>
  );
}
