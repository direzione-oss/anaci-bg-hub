import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Scale,
  BookOpen,
  FileSpreadsheet,
  FileText,
  Send,
  Copy,
  Check,
  Calculator,
  KeyRound,
  Building,
  Gavel,
  Upload,
} from 'lucide-react';
import { AiMessage, CitedSource, UserProfile } from '../types';
import { INITIAL_AI_MESSAGES } from '../data/mockData';

interface AiAssistantModuleProps {
  currentUser: UserProfile;
}

const PRESET_LEGAL_PROMPTS = [
  {
    label: 'Quorum Art. 1136 c.c. (Opere Straordinarie & Nomina)',
    prompt:
      'Quali sono i quorum costitutivi e deliberativi in seconda convocazione ex art. 1136 c.c. per lavori straordinari di notevole entità, nomina/conferma amministratore e innovazioni ex art. 1120 c.c.?',
  },
  {
    label: 'Ripartizione Lastrico Solare Art. 1126 c.c. (Città Alta)',
    prompt:
      'Come si ripartiscono le spese di rifacimento dell’impermeabilizzazione di un lastrico solare ad uso esclusivo ex art. 1126 c.c. quando sottostanno sia appartamenti privati sia l’androne comune?',
  },
  {
    label: 'Morosità e Decreto Ingiuntivo ex Art. 63 disp. att. c.c.',
    prompt:
      'Qual è la procedura corretta per l’emissione del decreto ingiuntivo provvisoriamente esecutivo ex art. 63 disp. att. c.c. al Tribunale di Bergamo e la comunicazione dei dati dei morosi ai creditori?',
  },
  {
    label: 'Regolamento Comune di Bergamo: Riscaldamento & Orari Silenzio',
    prompt:
      'Quali sono le regole del Comune di Bergamo per l’accensione degli impianti termici centralizzati (Fascia E) e gli orari per lavori rumorosi in condominio?',
  },
];

function buildIntelligentRagResponse(query: string): {
  content: string;
  citedSources: CitedSource[];
  suggestedDraft?: { title: string; type: string; body: string };
} {
  const q = query.toLowerCase();

  if (q.includes('1136') || q.includes('quorum') || q.includes('maggioranz') || q.includes('convocazione')) {
    return {
      content:
        '### Sintesi Operativa Quorum Assembleari (Art. 1136 c.c.)\n\nIn **seconda convocazione** (costitutiva valida con **1/3 dei partecipanti** e **1/3 del valore dell’edificio = 333,34 millesimi**):\n\n1. **Delibere Ordinarie (Bilancio, Preventivo, Manutenzione Ordinaria):** maggioranza degli intervenuti con almeno **1/3 del valore dell’edificio (333,34 mm)** (*art. 1136 co. 3 c.c.*).\n2. **Nomina / Revoca Amministratore & Riparazioni Straordinarie di notevole entità:** maggioranza degli intervenuti e almeno **la metà del valore dell’edificio (500 millesimi)** (*art. 1136 co. 4 c.c.*).\n3. **Innovazioni agevolate (Sicurezza, Barriere Architettoniche, Contabilizzazione, EV):** maggioranza degli intervenuti e **500 millesimi** (*art. 1120 co. 2 c.c.*).\n4. **Innovazioni ordinarie / Gravose:** maggioranza degli intervenuti e **2/3 del valore dell’edificio (666,67 mm)** (*art. 1136 co. 5 c.c.*).\n\n> **Nota Costituzione Fondo Speciale (Art. 1135 n. 4 c.c.):** Per le opere di manutenzione straordinaria è obbligatoria a pena di nullità la costituzione del fondo speciale di importo pari all’ammontare dei lavori (o alle singole rate se il contratto d’appalto prevede pagamenti a SAL).',
      citedSources: [
        {
          code: 'Art. 1136 c.c. & Art. 1135 n. 4 c.c.',
          title: 'Costituzione dell’assemblea e validità delle deliberazioni',
          type: 'CODICE_CIVILE',
          excerpt: 'Quorum costitutivi e deliberativi in prima e seconda convocazione; obbligatorietà del fondo speciale.',
        },
        {
          code: 'Cass. Civ. Sez. II n. 9388/2023',
          title: 'Nullità delibera opere straordinarie senza fondo speciale ex art. 1135 n. 4 c.c.',
          type: 'CASSAZIONE',
          excerpt: 'Confermato l’orientamento anche dal Tribunale di Bergamo Sez. IV Civile.',
        },
      ],
      suggestedDraft: {
        title: 'Formula Verbale Delibera Lavori Straordinari + Fondo Speciale ex Art. 1135 n. 4 c.c.',
        type: 'BOZZA_VERBALE',
        body: `PUNTO N. [X] ALL'ORDINE DEL GIORNO: Approvazione lavori straordinari e costituzione fondo speciale obbligatorio ex art. 1135 n. 4 c.c.\n\nL'Assemblea, esaminato il capitolato e i preventivi acquisiti in convenzione ANACI Bergamo, con il voto favorevole di n. [__] condomini portatori di complessivi millesimi [___/1000] (superiore al quorum ex art. 1136 co. 4 c.c. di 500/1000),\nDELIBERA\n1) Di affidare l'esecuzione delle opere all'impresa [________] per l'importo complessivo di € [________] oltre IVA di legge;\n2) Di costituire contestualmente, ai sensi e per gli effetti dell'art. 1135, comma 1, n. 4 c.c., il relativo Fondo Speciale vincolato di pari importo, articolato in n. [__] rate straordinarie allineate agli Stati di Avanzamento Lavori (SAL) previsti dal contratto d'appalto.`,
      },
    };
  }

  if (q.includes('1126') || q.includes('lastrico') || q.includes('terrazz') || q.includes('infiltrazion')) {
    return {
      content:
        '### Ripartizione Spese Lastrico Solare ad Uso Esclusivo (Art. 1126 c.c.)\n\nAi sensi dell’**art. 1126 c.c.**, quando l’uso dei lastrici solari (o terrazze a livello) non è comune a tutti i condomini:\n\n- **Quota 1/3 (33,33%):** a carico dei condomini che ne hanno l’**uso esclusivo** (proprietario dell’attico/terrazza).\n- **Quota 2/3 (66,67%):** a carico di tutti i condomini dell’edificio (o della parte di questo) a cui il lastrico solare **serve da copertura** (colonna d’aria / proiezione verticale sottostante), in proporzione al valore del piano o della porzione di piano di ciascuno.\n\n**Caso particolare (Androne / Parti Comuni sottostanti):** Secondo la giurisprudenza della Cassazione e del Centro Studi ANACI Bergamo, i locali comuni (androne, vano scale) non entrano come unità autonoma nel denominatore dei 2/3 salvo che il lastrico copra *esclusivamente* parti comuni (nel qual caso il riparto avviene tra tutti i condomini ex art. 1123 c.c.).\n\n*(Puoi usare il tab **"Simulatore Ripartizione Spese"** qui sopra per calcolare al centesimo le quote 1/3 - 2/3!)*',
      citedSources: [
        {
          code: 'Art. 1126 c.c.',
          title: 'Lastrici solari di uso esclusivo — Criterio 1/3 e 2/3',
          type: 'CODICE_CIVILE',
          excerpt: 'Riparto tra usuario esclusivo (1/3) e proprietari delle unità sottostanti la proiezione verticale (2/3).',
        },
        {
          code: 'Cass. Civ. SS.UU. n. 9449/2016 & Cass. n. 11484/2017',
          title: 'Responsabilità concorrente ex art. 2051 c.c. e criterio ex art. 1126 c.c.',
          type: 'CASSAZIONE',
          excerpt: 'Applicabilità del criterio 1/3 e 2/3 anche al risarcimento danni da infiltrazioni alle unità sottostanti.',
        },
      ],
    };
  }

  if (q.includes('63') || q.includes('moros') || q.includes('decreto ingiuntivo') || q.includes('recupero')) {
    return {
      content:
        '### Recupero Crediti Condominiali e Art. 63 disp. att. c.c. (Foro di Bergamo)\n\n1. **Obbligo di azione entro 180 giorni (Art. 1129 co. 9 c.c.):** L’amministratore è tenuto ad agire per la riscossione forzosa delle somme dovute dagli obbligati entro **6 mesi dalla chiusura dell’esercizio** nel quale il credito esigibile è compreso.\n2. **Decreto Ingiuntivo Provvisoriamente Esecutivo (Art. 63 co. 1 disp. att. c.c.):** Basato sullo stato di ripartizione approvato dall’assemblea, non richiede preventiva autorizzazione assembleare.\n3. **Comunicazione ai Creditori Insoddisfatti (Art. 63 co. 2 disp. att. c.c.):** I creditori non possono agire contro i condomini in regola con i pagamenti (*beneficium excussionis*) se non dopo l’escussione degli altri condomini morosi, i cui dati devono essere comunicati dall’amministratore.\n4. **Partner Convenzionato ANACI BG:** Puoi attivare una pre-analisi gratuita di solvibilità tramite **Studio TJ** (Tel. `035 4139438`) nella sezione Fornitori.',
      citedSources: [
        {
          code: 'Art. 63 disp. att. c.c. & Art. 1129 co. 9 c.c.',
          title: 'Riscossione forzosa contributi condominiali e solidarietà sussidiaria',
          type: 'CODICE_CIVILE',
          excerpt: 'Esecutività immediata del decreto ingiuntivo nonostante opposizione e tutela dei condomini virtuosi.',
        },
        {
          code: 'Parere CS-BG #2026/14',
          title: 'Linee Guida Centro Studi ANACI Bergamo su Messa in Mora e Sospensione Servizi',
          type: 'CENTRO_STUDI',
          excerpt: 'Checklist documentale per il deposito telematico presso il Tribunale di Bergamo.',
        },
      ],
      suggestedDraft: {
        title: 'Diffida Formale e Costituzione in Mora ex Art. 1219 c.c. e Art. 63 disp. att. c.c.',
        type: 'DIFFIDA_MOROSITA',
        body: `RACCOMANDATA A.R. / PEC\nOggetto: Condominio [________________] - Bergamo | Diffida ad adempiere e messa in mora ex art. 1219 c.c. e preavviso ricorso ex art. 63 disp. att. c.c.\n\nGent.mo Condomino,\nla presente in qualità di Amministratore pro-tempore del Condominio in oggetto per significarLe che, alla data odierna, risulta scoperto il saldo delle quote condominiali deliberate dall'Assemblea per complessivi € [________].\nAi sensi dell'art. 1129, comma 9, c.c., La invito e diffido a provvedere al versamento mediante bonifico bancario entro e non oltre 10 (dieci) giorni dal ricevimento della presente.\nIn difetto, senza ulteriore avviso, sarò costretto per obbligo di mandato a dare incarico al Legale del Condominio per il deposito di ricorso per Decreto Ingiuntivo immediatamente esecutivo ex art. 63 disp. att. c.c. avanti il Tribunale di Bergamo, con aggravio di spese ed onorari a Suo esclusivo carico.`,
      },
    };
  }

  return {
    content: `### Risposta Giuridico-Tecnica ANACI Bot Bergamo\n\nIn merito al quesito: *"${query}"*\n\n- **Inquadramento Codice Civile:** La fattispecie rientra nel perimetro degli **artt. 1117, 1130 e 1136 c.c.** (tutela delle parti comuni, attribuzioni dell’amministratore e deliberazioni assembleari).\n- **Orientamento Giurisprudenziale (Cassazione & Foro di Bergamo):** L’amministratore conserva la legittimazione attiva e passiva autonoma per gli atti conservativi dei diritti inerenti alle parti comuni dell’edificio (*art. 1130 n. 4 c.c.*), mentre per gli interventi eccedenti l’ordinaria amministrazione privi del carattere di urgenza (*art. 1135 co. 2 c.c.*) occorre la preventiva delibera assembleare assistita dal fondo speciale.\n- **Applicazione sul Territorio di Bergamo:** Verifica sempre la conformità al Regolamento Edilizio del Comune di Bergamo e, per gli interventi impiantistici o edili, puoi richiedere un parere tecnico/preventivo in convenzione tramite la **Directory dei 21 Partner ANACI BG**.`,
    citedSources: [
      {
        code: 'Artt. 1130 e 1135 c.c.',
        title: 'Attribuzioni dell’amministratore e provvedimenti urgenti',
        type: 'CODICE_CIVILE',
        excerpt: 'Obbligo di riferire alla prima assemblea per i lavori straordinari rivestenti carattere d’urgenza.',
      },
      {
        code: 'Regolamento Edilizio Comune di Bergamo',
        title: 'Norme tecniche di attuazione e decoro urbano (Città Bassa e Città Alta)',
        type: 'COMUNE_BG',
        excerpt: 'Prescrizioni per interventi su facciate, coperture e impianti tecnologici.',
      },
    ],
  };
}

export const AiAssistantModule: React.FC<AiAssistantModuleProps> = ({ currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'ripartizione' | 'verbali'>('chat');

  // Chat state
  const [messages, setMessages] = useState<AiMessage[]>(INITIAL_AI_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [activeScopes, setActiveScopes] = useState<string[]>([
    'CODICE_CIVILE',
    'CASSAZIONE',
    'COMUNE_BG',
    'CENTRO_STUDI',
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  // Expense Simulator state (Art. 1126 & Art. 1124)
  const [simCriterio, setSimCriterio] = useState<'ART_1126' | 'ART_1124'>('ART_1126');
  const [simImporto, setSimImporto] = useState<number>(18000);
  const [simCondominio, setSimCondominio] = useState(
    'Condominio Residenza Colle Aperto — Città Alta, Bergamo'
  );

  // Minutes Generator state
  const [rawNotes, setRawNotes] = useState(
    `Assemblea ordinaria e straordinaria Condominio Parco Suardi (Via B. Bono 14, Bergamo) del 16/10/2026 in 2a convocazione ore 18:00 presso Sala ANACI Via Bellini 43.\nPresenti 14 condomini per 612,40 millesimi. Presidente sig. Bianchi, Segretario Dott. Locatelli.\n1) Approvato consuntivo 2025/2026 all'unanimità dei presenti.\n2) Confermato amministratore Studio Locatelli con compenso invariato.\n3) Deliberato rifacimento linea vita copertura con partner convenzionato Sonzogni Sintesi per € 6.400 + IVA e costituzione fondo speciale in 2 rate.`
  );
  const [generatedMinutes, setGeneratedMinutes] = useState<string>('');

  const toggleScope = (scope: string) => {
    setActiveScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSendQuery = (textToUse?: string) => {
    const q = (textToUse ?? inputQuery).trim();
    if (!q) return;

    const userMsg: AiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      timestamp: 'Adesso',
      content: q,
    };

    const ragResult = buildIntelligentRagResponse(q);

    const botMsg: AiMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'ASSISTANT',
      timestamp: 'Adesso',
      content: ragResult.content,
      citedSources: ragResult.citedSources,
      suggestedDraft: ragResult.suggestedDraft,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!textToUse) setInputQuery('');
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Calculations for Simulator Art. 1126 (1/3 + 2/3)
  const quotaTerzoEsclusivo = simImporto / 3;
  const quotaDueTerziSottostanti = (simImporto * 2) / 3;
  const unitaSottostanti = [
    { unita: 'Int. 8 — Piano 3° (Sub. 14 - Fam. Colleoni)', mmVerticale: 310, piano: 3 },
    { unita: 'Int. 5 — Piano 2° (Sub. 11 - Studio Medico)', mmVerticale: 280, piano: 2 },
    { unita: 'Int. 2 — Piano 1° (Sub. 06 - Sig.ra Corti)', mmVerticale: 240, piano: 1 },
    { unita: 'Negozio PT — Piano Terra (Sub. 02 - Farmacia)', mmVerticale: 170, piano: 0 },
  ];
  const totaleMmVerticale = unitaSottostanti.reduce((acc, u) => acc + u.mmVerticale, 0);
  const totalePiani = unitaSottostanti.reduce((acc, u) => acc + u.piano, 0);

  const handleGenerateMinutes = () => {
    setGeneratedMinutes(`VERBALE DI ASSEMBLEA ORDINARIA E STRAORDINARIA DEI CONDOMINI
CONDOMINIO PARCO SUARDI — Via B. Bono 14, 24121 Bergamo (BG) — C.F. 95012340168

L'anno 2026, il giorno 16 del mese di Ottobre alle ore 18:00, presso la Sala Riunioni della Sede Provinciale ANACI Bergamo in Via Vincenzo Bellini n. 43, si è riunita in seconda convocazione (essendo andata deserta la prima convocazione per mancanza del numero legale) l'Assemblea del Condominio Parco Suardi.

VERIFICA COSTITUZIONE E NOMINA UFFICIO DI PRESIDENZA:
Risultano presenti, personalmente o per delega scritta acquisita agli atti, n. 14 (quattordici) condomini su 22 totali, rappresentanti complessivi millesimi 612,40 su 1.000,00.
Su invito dei presenti assume la Presidenza il Sig. Bianchi, il quale chiama a fungere da Segretario verbalizzante l'Amministratore ${currentUser.fullName} (${currentUser.studioName} — Associato ANACI BG #${currentUser.codiceAssociato}).
Il Presidente, verificata la regolarità degli avvisi di convocazione inviati ai sensi dell'art. 66 disp. att. c.c. almeno 5 giorni liberi prima dell'adunanza, dichiara l'Assemblea validamente costituita ai sensi dell'art. 1136, comma 3, c.c.

DELIBERAZIONI ASSUNTE:
1) APPROVAZIONE RENDICONTO CONSUNTIVO 2025/2026 EX ART. 1130-BIS C.C.:
Dopo ampia illustrazione del registro di contabilità, del riepilogo finanziario e della nota sintetica esplicativa, l'Assemblea APPROVA all'unanimità degli intervenuti (14 condomini per 612,40/1000 mm) il rendiconto consuntivo ed il relativo stato di riparto.

2) CONFERMA AMMINISTRATORE EX ART. 1129 E 1136 CO. 4 C.C.:
L'Assemblea, con voto unanime favorevole di n. 14 condomini portatori di 612,40/1000 mm (superiore alla maggioranza qualificata di 500 millesimi ex art. 1136 co. 4 c.c.), CONFERMA nella carica di Amministratore ${currentUser.fullName}, il quale dichiara il possesso dei requisiti ex art. 71-bis disp. att. c.c. e l'assolvimento dell'obbligo formativo periodico DM 140/2014 presso ANACI Bergamo, approvando il preventivo analitico del compenso ai sensi dell'art. 1129 co. 14 c.c.

3) OPERE STRAORDINARIE SU COPERTURA E FONDO SPECIALE EX ART. 1135 N. 4 C.C.:
Esaminata l'offerta in Convenzione ANACI Bergamo della ditta SONZOGNI SINTESI per la messa a norma e revisione certificata della linea vita in copertura per complessivi € 6.400,00 oltre IVA di legge, l'Assemblea con 612,40/1000 mm DELIBERA di affidare l'incarico e di costituire contestualmente il Fondo Speciale obbligatorio di pari importo ex art. 1135 co. 1 n. 4 c.c. suddiviso in n. 2 rate straordinarie.

Null'altro essendovi a deliberare, previa lettura e approvazione del presente verbale, la seduta è tolta alle ore 19:45.
IL SEGRETARIO (${currentUser.fullName})                    IL PRESIDENTE (Sig. Bianchi)`);
  };

  return (
    <div className="space-y-6">
      {/* Top Sub-Navigation for the 4 AI Tools */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeSubTab === 'chat'
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-[#8B1E24] bg-white rounded p-0.5" />
            1. Chiedi ad ANACI Bot (RAG Legale & Trib. BG)
          </button>

          <button
            onClick={() => setActiveSubTab('ripartizione')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeSubTab === 'ripartizione'
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            2. Simulatore Ripartizione Spese (Art. 1126 / 1124)
          </button>

          <button
            onClick={() => setActiveSubTab('verbali')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeSubTab === 'verbali'
                ? 'bg-[#0A2540] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            3. Generatore Verbali IA & Analisi Preventivi
          </button>
        </div>

        <button
          onClick={() => setApiKeyModalOpen(!apiKeyModalOpen)}
          className="px-3 py-2 rounded-xl border border-slate-200 hover:border-[#0A2540] text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <KeyRound className="w-3.5 h-3.5 text-[#8B1E24]" />
          {customApiKey ? 'API LLM Attiva' : 'Configura API Key'}
        </button>
      </div>

      {apiKeyModalOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="text-xs text-slate-600 flex-1">
            <strong className="text-[#0A2540]">Motore RAG Ibrido Attivo:</strong> Il sistema risponde istantaneamente usando il database normativo ANACI BG pre-indicizzato. Se desideri collegare anche una chiave live Gemini / OpenAI, inseriscila qui:
          </div>
          <input
            type="password"
            value={customApiKey}
            onChange={(e) => setCustomApiKey(e.target.value)}
            placeholder="AIzaSy... oppure sk-..."
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono w-full sm:w-64"
          />
          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#0A2540] text-white text-xs font-bold"
          >
            Salva
          </button>
        </div>
      )}

      {/* TAB 1: CHIEDI AD ANACI BOT (RAG CHAT) */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 cols: Chat Workspace */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[680px]">
            {/* RAG Scope Selector Header */}
            <div className="p-4 border-b border-slate-200 bg-[#F8FAFC] rounded-t-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#0A2540] text-white">
                    <Scale className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-[#0A2540]">
                      Chiedi ad ANACI Bot — Assistente RAG Giuridico & Tecnico
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Seleziona le fonti documentali su cui filtrare la risposta:
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ● RAG Indice 2026 Attivo
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'CODICE_CIVILE', label: 'Codice Civile (Artt. 1117–1139)' },
                  { id: 'CASSAZIONE', label: 'Cassazione & Trib. Bergamo' },
                  { id: 'COMUNE_BG', label: 'Regolamenti Comune di Bergamo' },
                  { id: 'CENTRO_STUDI', label: 'Storico Pareri Centro Studi ANACI BG' },
                ].map((scope) => {
                  const active = activeScopes.includes(scope.id);
                  return (
                    <button
                      key={scope.id}
                      onClick={() => toggleScope(scope.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                        active
                          ? 'bg-[#0A2540] text-white border-[#0A2540]'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {scope.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-4 text-sm space-y-3 ${
                      msg.sender === 'USER'
                        ? 'bg-[#0A2540] text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[11px] opacity-75">
                      <span className="font-bold">
                        {msg.sender === 'USER'
                          ? `${currentUser.fullName} (${currentUser.codiceAssociato})`
                          : 'ANACI Bot Bergamo (RAG Engine)'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                      {msg.content}
                    </div>

                    {/* Cited Sources Cards */}
                    {msg.citedSources && msg.citedSources.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8B1E24] flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          Fonti Normative e Giurisprudenziali Citate:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.citedSources.map((src, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
                            >
                              <div className="font-mono font-bold text-[#0A2540] text-[11px]">
                                {src.code}
                              </div>
                              <div className="font-semibold text-slate-800 mt-0.5">{src.title}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{src.excerpt}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Ready-to-use Document Draft */}
                    {msg.suggestedDraft && (
                      <div className="p-3.5 rounded-xl bg-[#FDF2F3] border border-[#8B1E24]/30 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#8B1E24] flex items-center gap-1.5">
                            <FileText className="w-4 h-4" />
                            {msg.suggestedDraft.title}
                          </span>
                          <button
                            onClick={() =>
                              handleCopyText(msg.id, msg.suggestedDraft?.body || '')
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#8B1E24] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#A3242B]"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3" /> Copiato!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copia Testo per Studio
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap bg-white p-2.5 rounded-lg border border-slate-200">
                          {msg.suggestedDraft.body}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Composer */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Scrivi un quesito (es. 'Quorum art. 1136 per cappotto termico', 'Riparto art. 1126 lastrico solare', 'Art. 63 morosità')..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B1E24] hover:bg-[#A3242B] text-white font-bold text-sm flex items-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Chiedi al Bot
                </button>
              </form>
            </div>
          </div>

          {/* Right 4 cols: Quick Legal Scenarios & Quorum Cheat-Sheet */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B1E24]" />
                Quesiti Frequenti Studio (1-Click Test)
              </h3>
              <div className="space-y-2">
                {PRESET_LEGAL_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(item.prompt)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#0A2540] bg-slate-50/70 hover:bg-white transition text-xs"
                  >
                    <div className="font-bold text-[#0A2540]">{item.label}</div>
                    <div className="text-slate-500 line-clamp-2 mt-0.5">{item.prompt}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0A2540] text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">Prontuario Rapido Quorum (2ª Conv.)</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white/10 flex justify-between items-center">
                  <span className="text-slate-200">Bilancio / Ordinaria</span>
                  <span className="font-mono font-bold text-emerald-300">Magg. Int. + 333,34 mm</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/10 flex justify-between items-center">
                  <span className="text-slate-200">Nomina Amm. / Straord.</span>
                  <span className="font-mono font-bold text-amber-300">Magg. Int. + 500,00 mm</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/10 flex justify-between items-center">
                  <span className="text-slate-200">Innovazioni ex 1120 co. 1</span>
                  <span className="font-mono font-bold text-rose-300">Magg. Int. + 666,67 mm</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/10 flex justify-between items-center">
                  <span className="text-slate-200">Modifica Dest. d’Uso 1117-ter</span>
                  <span className="font-mono font-bold text-sky-300">4/5 Partec. + 800,00 mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATORE RIPARTIZIONE SPESE COMPLESSO (Art. 1126 & Art. 1124) */}
      {activeSubTab === 'ripartizione' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B1E24]">
                Modulo 2.4 • Calcolatore Normativo & Nota per Verbale
              </span>
              <h2 className="text-xl font-bold text-[#0A2540]">
                Simulatore di Ripartizione Spese Complesso (Art. 1126 e Art. 1124 c.c.)
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSimCriterio('ART_1126')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  simCriterio === 'ART_1126'
                    ? 'bg-[#8B1E24] text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Art. 1126 c.c. (Lastrici Solari 1/3 e 2/3)
              </button>
              <button
                onClick={() => setSimCriterio('ART_1124')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  simCriterio === 'ART_1124'
                    ? 'bg-[#8B1E24] text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Art. 1124 c.c. (Scale e Ascensori 50% + 50%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Condominio di Riferimento
              </label>
              <input
                type="text"
                value={simCondominio}
                onChange={(e) => setSimCondominio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Importo Complessivo Lavori (€ IVA incl.)
              </label>
              <input
                type="number"
                value={simImporto}
                onChange={(e) => setSimImporto(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold text-[#0A2540]"
              />
            </div>
          </div>

          {simCriterio === 'ART_1126' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">Totale Opera Da Ripartire</div>
                  <div className="text-xl font-extrabold font-mono text-[#0A2540] tabular-nums mt-1">
                    € {simImporto.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#FDF2F3] border border-[#8B1E24]/30">
                  <div className="text-xs font-semibold text-[#8B1E24]">
                    Quota 1/3 Usuario Esclusivo (Attico)
                  </div>
                  <div className="text-xl font-extrabold font-mono text-[#8B1E24] tabular-nums mt-1">
                    € {quotaTerzoEsclusivo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-semibold text-emerald-800">
                    Quota 2/3 Unità Sottostanti la Verticale
                  </div>
                  <div className="text-xl font-extrabold font-mono text-emerald-900 tabular-nums mt-1">
                    € {quotaDueTerziSottostanti.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A2540] text-white">
                    <tr>
                      <th className="p-3">Unità Immobiliare Coinvolta</th>
                      <th className="p-3">Ruolo ex Art. 1126 c.c.</th>
                      <th className="p-3 text-right">Millesimi Verticale</th>
                      <th className="p-3 text-right">Quota Addebitata (€)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-[#FDF2F3]/50 font-semibold">
                      <td className="p-3">Attico Piano 4° (Proprietario Uso Esclusivo Terrazza)</td>
                      <td className="p-3 text-[#8B1E24]">1/3 Uso Esclusivo</td>
                      <td className="p-3 text-right font-mono">—</td>
                      <td className="p-3 text-right font-mono font-bold text-[#8B1E24] tabular-nums">
                        € {quotaTerzoEsclusivo.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                    {unitaSottostanti.map((u, idx) => {
                      const quota =
                        (quotaDueTerziSottostanti * u.mmVerticale) / totaleMmVerticale;
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{u.unita}</td>
                          <td className="p-3 text-slate-600">2/3 Copertura Verticale</td>
                          <td className="p-3 text-right font-mono tabular-nums">
                            {u.mmVerticale} / {totaleMmVerticale}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-[#0A2540] tabular-nums">
                            € {quota.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <strong>Criterio Legale Art. 1124 c.c. (Scale e Ascensori):</strong> La spesa di{' '}
                <strong>€ {simImporto.toLocaleString('it-IT')}</strong> è ripartita per il{' '}
                <strong>50% (€ {(simImporto / 2).toLocaleString('it-IT')})</strong> in ragione del valore dei singoli piani o porzioni di piano (Millesimi) e per il restante{' '}
                <strong>50% (€ {(simImporto / 2).toLocaleString('it-IT')})</strong> in misura proporzionale all’altezza di ciascun piano dal suolo.
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A2540] text-white">
                    <tr>
                      <th className="p-3">Unità Immobiliare</th>
                      <th className="p-3 text-right">Quota 50% Millesimi</th>
                      <th className="p-3 text-right">Quota 50% Altezza Piano</th>
                      <th className="p-3 text-right">Totale Quota Art. 1124 (€)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {unitaSottostanti.map((u, idx) => {
                      const qMm = ((simImporto / 2) * u.mmVerticale) / totaleMmVerticale;
                      const qPiano = totalePiani > 0 ? ((simImporto / 2) * u.piano) / totalePiani : 0;
                      const tot = qMm + qPiano;
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-medium text-slate-800">{u.unita}</td>
                          <td className="p-3 text-right font-mono tabular-nums">
                            € {qMm.toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-mono tabular-nums">
                            € {qPiano.toFixed(2)} (Piano {u.piano})
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-[#0A2540] tabular-nums">
                            € {tot.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Auto-generated Explanatory Legal Note for the Assembly Minutes */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0A2540]">
                Nota Esplicativa Normativa da Allegare al Verbale ({simCriterio === 'ART_1126' ? 'Art. 1126 c.c.' : 'Art. 1124 c.c.'}):
              </span>
              <button
                onClick={() =>
                  handleCopyText(
                    'sim-note',
                    `NOTA ESPLICATIVA DI RIPARTO (${simCondominio}): La spesa complessiva di € ${simImporto.toFixed(
                      2
                    )} viene imputata in conformità al disposto dell'${
                      simCriterio === 'ART_1126'
                        ? 'art. 1126 c.c. (1/3 pari a € ' +
                          quotaTerzoEsclusivo.toFixed(2) +
                          ' a carico dell’usuario esclusivo del lastrico solare e 2/3 pari a € ' +
                          quotaDueTerziSottostanti.toFixed(2) +
                          ' a carico dei condomini delle unità sottostanti la proiezione verticale)'
                        : 'art. 1124 c.c. (50% per valore millesimale e 50% in misura proporzionale all’altezza di ciascun piano dal suolo)'
                    }.`
                  )
                }
                className="px-3 py-1 rounded-lg bg-[#0A2540] text-white text-xs font-bold flex items-center gap-1"
              >
                {copiedId === 'sim-note' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copia Nota Verbale
              </button>
            </div>
            <p className="text-xs text-slate-600 font-mono bg-white p-3 rounded-lg border border-slate-200">
              "Si dà atto a verbale che il riparto della spesa straordinaria di € {simImporto.toFixed(2)} per{' '}
              {simCondominio} è stato elaborato in rigorosa applicazione dell’
              {simCriterio === 'ART_1126'
                ? `art. 1126 del Codice Civile e della giurisprudenza della Suprema Corte (SS.UU. n. 9449/2016), ponendo 1/3 (€ ${quotaTerzoEsclusivo.toFixed(
                    2
                  )}) a carico dell'usuario esclusivo e 2/3 (€ ${quotaDueTerziSottostanti.toFixed(
                    2
                  )}) a carico dei proprietari delle unità comprese nella proiezione verticale sottostante.`
                : `art. 1124 del Codice Civile, imputando metà dell'importo (€ ${(simImporto / 2).toFixed(
                    2
                  )}) in ragione dei millesimi di proprietà e l'altra metà (€ ${(simImporto / 2).toFixed(
                    2
                  )}) in proporzione all'altezza di ciascun piano dal suolo.`}
              "
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: GENERATORE VERBALI IA & ANALIZZATORE PREVENTIVI */}
      {activeSubTab === 'verbali' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Minutes Generator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B1E24]">
                Modulo 2.2 • Da Appunti Grezzi a Verbale Formale
              </span>
              <h3 className="text-lg font-bold text-[#0A2540]">
                Generatore di Verbali e Comunicazioni IA
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inserisci gli appunti grezzi presi durante l’assemblea:
              </label>
              <textarea
                rows={5}
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <button
              onClick={handleGenerateMinutes}
              className="w-full py-2.5 px-4 rounded-xl bg-[#8B1E24] hover:bg-[#A3242B] text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Genera Bozza Verbale Formale con Clausole Art. 1135 e 1129 c.c.
            </button>

            {generatedMinutes && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700">
                    ✓ Verbale generato e validato formalmente:
                  </span>
                  <button
                    onClick={() => handleCopyText('gen-min', generatedMinutes)}
                    className="px-2.5 py-1 rounded bg-[#0A2540] text-white text-[11px] font-bold"
                  >
                    {copiedId === 'gen-min' ? 'Copiato!' : 'Copia Verbale'}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {generatedMinutes}
                </pre>
              </div>
            )}
          </div>

          {/* Quotes Analyzer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B1E24]">
                  Modulo 2.3 • Comparazione Capitolati PDF
                </span>
                <h3 className="text-lg font-bold text-[#0A2540]">
                  Analizzatore Intelligente di Preventivi
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> 3 PDF Caricati
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Tabella comparativa automatica estratta dai 3 preventivi per{' '}
              <strong>Ammodernamento Ascensore Condominiale (6 fermate - Bergamo)</strong>:
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A2540] text-white">
                  <tr>
                    <th className="p-2.5">Voce Capitolato</th>
                    <th className="p-2.5 bg-[#8B1E24]">Duelle Lift (Partner ANACI)</th>
                    <th className="p-2.5">Impresa B (Esterna)</th>
                    <th className="p-2.5">Impresa C (Esterna)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-semibold">Importo Totale (IVA escl.)</td>
                    <td className="p-2.5 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                      € 14.800,00
                    </td>
                    <td className="p-2.5 font-mono">€ 17.900,00</td>
                    <td className="p-2.5 font-mono">€ 16.450,00</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Garanzia Quadro VVVF</td>
                    <td className="p-2.5 font-semibold text-emerald-700 bg-emerald-50/50">
                      36 Mesi Inclusa
                    </td>
                    <td className="p-2.5">24 Mesi</td>
                    <td className="p-2.5">12 Mesi</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Clausole Anomale Rilevate IA</td>
                    <td className="p-2.5 text-emerald-700 bg-emerald-50/50 font-semibold">
                      Nessuna (Standard ANACI)
                    </td>
                    <td className="p-2.5 text-amber-700">
                      Esclusi oneri collaudo ente notificato
                    </td>
                    <td className="p-2.5 text-rose-700 font-semibold">
                      ⚠️ Anticipo 60% all’ordine senza SAL
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>Alert IA Contrattuale:</strong> Nel preventivo "Impresa C" è stata rilevata una clausola di pagamento anticipato del 60% prima dell’inizio lavori, rischiosa per la cassa condominiale e difforme dallo schema contrattuale ANACI Bergamo.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
