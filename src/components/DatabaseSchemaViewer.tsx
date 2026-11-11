import React, { useState } from 'react';
import { Database, Copy, Check, Table, Key, ShieldCheck, Layers } from 'lucide-react';

export const DatabaseSchemaViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'seed'>('tables');
  const [copied, setCopied] = useState(false);

  const tablesOverview = [
    {
      name: 'users',
      module: '1. Autenticazione & RBAC',
      pk: 'id (UUID)',
      fields:
        'codice_associato (UNIQUE, es. BG-1042), email, password_hash, role (ASSOCIATO | ESPERTO | PARTNER | ADMIN), full_name, studio_name, zona_operativa, cfp_maturati_anno, cfp_obiettivo_anno',
      desc: 'Gestisce i 4 ruoli RBAC e traccia il contatore personale dei crediti formativi DM 140/2014.',
    },
    {
      name: 'partners',
      module: '6. Modulo Sponsor & Convenzioni',
      pk: 'id (SERIAL)',
      fields:
        'slug, company_name, category (ENERGIA_CALORE | IMPIANTI_SICUREZZA | PULIZIE_MULTISERVIZI | STUDIO_FISCO_CREDITI), sector, referent_name, phone, email, vantaggi_associati, zone_coperte, rating_medio',
      desc: 'Pre-popolata con le 21 aziende convenzionate ANACI Servizi Integrati srl di Bergamo.',
    },
    {
      name: 'partner_quote_requests',
      module: '6. Richieste Preventivo Precompilate',
      pk: 'id (UUID)',
      fields:
        'partner_id (FK), associate_id (FK), studio_name, condominio_riferimento, tipo_richiesta, urgenza, note_dettaglio, stato',
      desc: 'Archivia le richieste di preventivo/sopralluogo in convenzione inviate dagli associati.',
    },
    {
      name: 'partner_reviews',
      module: '4 & 6. Albo Fornitori & Feedback Riservato',
      pk: 'id (UUID)',
      fields:
        'partner_id (FK), associate_id (FK), rating (1-5), tipo_intervento, commento_riservato, is_anonymous_to_partner',
      desc: 'Recensioni visibili e compilabili solo dagli associati verificati ANACI Bergamo.',
    },
    {
      name: 'sos_posts & sos_replies',
      module: '3. Bacheca SOS Condominio & Centro Studi',
      pk: 'id (UUID)',
      fields:
        'author_id (FK), is_anonymous, anonymous_alias, primary_tag, zona_condominio, urgency, status, is_official_expert_opinion, helpful_votes_count',
      desc: 'Supporta post anonimizzati, Voto Utile dei colleghi e Pareri Ufficiali degli Esperti del Centro Studi.',
    },
    {
      name: 'ai_chat_sessions & ai_chat_messages',
      module: '2. Modulo IA ("Chiedi ad ANACI Bot")',
      pk: 'id (UUID)',
      fields:
        'user_id (FK), knowledge_scopes (ARRAY), sender, content, cited_sources (JSONB), generated_artifact_type',
      desc: 'Conversazioni RAG con citazioni strutturate su Codice Civile (1117-1139), Cassazione e Regolamenti BG.',
    },
    {
      name: 'training_events & room_bookings',
      module: '5. Formazione DM 140/2014 & Sala Via Bellini 43',
      pk: 'id (UUID)',
      fields:
        'codice_evento, crediti_cfp, room_name ("Sala Assemblee Sede ANACI BG - Via V. Bellini 43"), associate_id (FK), condominio_assemblea, booking_date',
      desc: 'Gestione eventi formativi accreditati e booking in tempo reale della sala riunioni di Bergamo.',
    },
  ];

  const sqlSnippet = `-- File completo salvato in: /database/schema.sql e /prisma/schema.prisma
CREATE TYPE user_role AS ENUM ('ASSOCIATO', 'ESPERTO', 'PARTNER', 'ADMIN');
CREATE TYPE partner_category AS ENUM (
    'ENERGIA_CALORE',
    'IMPIANTI_SICUREZZA',
    'PULIZIE_MULTISERVIZI',
    'STUDIO_FISCO_CREDITI'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codice_associato VARCHAR(32) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'ASSOCIATO',
    full_name VARCHAR(150) NOT NULL,
    studio_name VARCHAR(200),
    cfp_maturati_anno INT DEFAULT 0,
    cfp_obiettivo_anno INT DEFAULT 15,
    is_verified BOOLEAN DEFAULT TRUE
);

CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    category partner_category NOT NULL,
    category_label VARCHAR(120) NOT NULL,
    sector VARCHAR(150) NOT NULL,
    referent_name VARCHAR(150),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    vantaggi_associati TEXT,
    zone_coperte VARCHAR(255) DEFAULT 'Bergamo e Provincia',
    rating_medio NUMERIC(3,2) DEFAULT 4.80
);`;

  const seedSnippet = `-- File completo con tutti i 21 Partner salvato in: /database/seed_partners.sql
INSERT INTO partners (id, slug, company_name, category, sector, referent_name, phone, email) VALUES
(1, 'bergamo-gas-e-luce', 'Bergamo Gas e Luce', 'ENERGIA_CALORE', 'Energia elettrica e gas', 'Ilario Centimerio', '342 1623550', 'ilario.centimerio@bergamogaseluce.it'),
(2, 'dts-srl', 'DTS Srl', 'ENERGIA_CALORE', 'Energia elettrica e gas', 'Gianluca Piro', '339 5809660', 'gianluca.piro@dtssrl.com'),
(3, 'energy-up', 'Energy Up', 'ENERGIA_CALORE', 'Energia elettrica e gas', NULL, '800 567567', 'servizioclienti@energy-up.it'),
(4, 'simecom', 'Simecom', 'ENERGIA_CALORE', 'Energia elettrica e gas', 'Alessandro Gallo', '348 5342800', 'alessandro.gallo@simecom.it'),
(5, 'promax-energia', 'Promax Energia', 'ENERGIA_CALORE', 'Energia elettrica e gas', 'Gregory Airopetyan', '338 6097174', 'direzione@promaxenergia.com'),
(6, 'infinity-control-service', 'Infinity Control Service', 'ENERGIA_CALORE', 'Contabilizzazione del calore', NULL, '035 0433829', 'info@infinitycontrolservice.com'),
(7, 'duelle-lift', 'Duelle Lift', 'IMPIANTI_SICUREZZA', 'Ascensori', 'Stefano Pegorari', '335 1227655', 'stefano.pegorari@duellelift.com'),
(8, 'idromac', 'IDROMAC', 'IMPIANTI_SICUREZZA', 'Idraulica', NULL, '0363 760086', 'idromac@gmail.com'),
(9, 'crotti-safety', 'Crotti Safety', 'IMPIANTI_SICUREZZA', 'Antincendio', NULL, '035 6304701', 'info@crottisafety.it'),
(10, 'rear-gsa', 'Rear GSA (Gruppo Rear)', 'IMPIANTI_SICUREZZA', 'Antincendio', NULL, '035 344509', 'amministrazione@grupporear.it'),
(11, 'sonzogni-sintesi', 'Sonzogni Sintesi', 'IMPIANTI_SICUREZZA', 'Dispositivi anticaduta e linee vita', NULL, '035 0448433', 'info@sonzognisintesi.it'),
(12, 'csdm', 'CSDM', 'IMPIANTI_SICUREZZA', 'Ente di Certificazione e Ispezione', NULL, '02 56816188', 'info@csdm.it'),
(13, 'life-srl', 'Life Srl', 'PULIZIE_MULTISERVIZI', 'Pulizie condominiali', NULL, '039 5781260', 'lifesrlbergamo@gmail.com'),
(14, 'mocit', 'MOCIT', 'PULIZIE_MULTISERVIZI', 'Disinfestazione e derattizzazione', NULL, '035 212011', 'info@mocit.it'),
(15, 'cmc-multiservice', 'CMC (Multiservice Condominio)', 'PULIZIE_MULTISERVIZI', 'Multiservizi', NULL, '035 0390611', 'info@multiservicecondominio.it'),
(16, 'soquick', 'SoQuick', 'PULIZIE_MULTISERVIZI', 'Servizi per condomini', 'Nadia Domanico', '344 0414389', 'nadia.domanico@soquick.it'),
(17, 'tresessanta-group', 'Tresessanta Group', 'PULIZIE_MULTISERVIZI', 'Servizi per condomini', NULL, '035 0086961', 'backoffice@tresessanta.com'),
(18, 'very-fast-people', 'Very Fast People', 'PULIZIE_MULTISERVIZI', 'Servizi per condomini', NULL, '800 035452', NULL),
(19, 'servizio-unico', 'Servizio Unico', 'STUDIO_FISCO_CREDITI', 'Consulenza fiscale', NULL, '035 794335', 'info@serviziounico.it'),
(20, 'studio-tj', 'Studio TJ', 'STUDIO_FISCO_CREDITI', 'Recupero del credito', NULL, '035 4139438', 'info@studiotj.it'),
(21, 'tutto-ufficio', 'Tutto Ufficio', 'STUDIO_FISCO_CREDITI', 'Forniture e servizi per l''amministratore', NULL, '02 9092683', 'info@tutto-ufficio.it');`;

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0A2540] text-white rounded-2xl p-6 border border-[#12385E] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1E24] text-white uppercase tracking-wider">
            Architettura Dati & Persistenza
          </span>
          <h1 className="text-2xl font-extrabold mt-1">
            Schema del Database Relazionale (SQL & Prisma ORM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            I file completi sono stati generati nella cartella di progetto:{' '}
            <code className="text-amber-300 font-mono">database/schema.sql</code>,{' '}
            <code className="text-amber-300 font-mono">database/seed_partners.sql</code> e{' '}
            <code className="text-amber-300 font-mono">prisma/schema.prisma</code>.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
              activeTab === 'tables'
                ? 'bg-[#8B1E24] text-white'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            Mappa Entità ER
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
              activeTab === 'sql'
                ? 'bg-[#8B1E24] text-white'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            DDL SQL
          </button>
          <button
            onClick={() => setActiveTab('seed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${
              activeTab === 'seed'
                ? 'bg-[#8B1E24] text-white'
                : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            Seed 21 Partner
          </button>
        </div>
      </div>

      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tablesOverview.map((tb) => (
            <div
              key={tb.name}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-sm text-[#0A2540] flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-[#8B1E24]" />
                  {tb.name}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {tb.module}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500">
                <strong className="text-slate-700">PK:</strong> {tb.pk} |{' '}
                <strong className="text-slate-700">Colonne chiave:</strong> {tb.fields}
              </div>
              <p className="text-xs text-slate-700 pt-1 border-t border-slate-100">{tb.desc}</p>
            </div>
          ))}
        </div>
      )}

      {(activeTab === 'sql' || activeTab === 'seed') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A2540] font-mono">
              {activeTab === 'sql' ? 'database/schema.sql' : 'database/seed_partners.sql'}
            </span>
            <button
              onClick={() => handleCopy(activeTab === 'sql' ? sqlSnippet : seedSnippet)}
              className="px-3 py-1.5 rounded-lg bg-[#0A2540] text-white text-xs font-bold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiato!' : 'Copia SQL'}
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
            {activeTab === 'sql' ? sqlSnippet : seedSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
