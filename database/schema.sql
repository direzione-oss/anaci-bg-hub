-- ============================================================================
-- ANACI BG HUB - SCHEMA DATABASE RELAZIONALE COMPLETO (PostgreSQL / SQLite)
-- Associazione Nazionale Amministratori Condominiali e Immobiliari - Bergamo
-- Sede Provinciale: Via Vincenzo Bellini 43, 24129 Bergamo (BG)
-- ============================================================================

-- 1. ENUMS & TIPI BASE (Compatibili PostgreSQL)
-- Ruoli RBAC: ASSOCIATO, ESPERTO, PARTNER, ADMIN
CREATE TYPE user_role AS ENUM ('ASSOCIATO', 'ESPERTO', 'PARTNER', 'ADMIN');
CREATE TYPE ticket_status AS ENUM ('APERTO', 'IN_LAVORAZIONE', 'RISOLTO', 'ARCHIVIATO');
CREATE TYPE urgency_level AS ENUM ('BASSA', 'NORMALE', 'ALTA', 'CRITICA');
CREATE TYPE partner_category AS ENUM (
    'ENERGIA_CALORE',
    'IMPIANTI_SICUREZZA',
    'PULIZIE_MULTISERVIZI',
    'STUDIO_FISCO_CREDITI'
);
CREATE TYPE bergamo_zone AS ENUM (
    'BERGAMO_CITTA',
    'CITTA_ALTA_COLLI',
    'VAL_SERIANA',
    'VAL_BREMBANA',
    'ISOLA_BERGAMASCA',
    'BASSA_BERGAMASCA',
    'VAL_CAVALLINA_SEBINO',
    'INTERA_PROVINCIA'
);

-- ============================================================================
-- 2. MODULO UTENTI, AUTENTICAZIONE & RBAC
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codice_associato VARCHAR(32) UNIQUE,              -- Es. "BG-1042" (Null per Partner esterni)
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'ASSOCIATO',
    full_name VARCHAR(150) NOT NULL,
    studio_name VARCHAR(200),                         -- Denominazione Studio Amministrazione
    partita_iva VARCHAR(20),
    phone VARCHAR(40),
    pec_email VARCHAR(255),
    zona_operativa bergamo_zone DEFAULT 'BERGAMO_CITTA',
    specialty VARCHAR(100),                           -- Per ESPERTO: 'Legale', 'Fiscale', 'Tecnico/Edilizio'
    cfp_maturati_anno INT DEFAULT 0,                  -- Crediti Formativi DM 140/2014 anno corrente
    cfp_obiettivo_anno INT DEFAULT 15,                -- Obbligo annuale DM 140/2014 (15 CFP)
    is_verified BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_codice ON users(codice_associato);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- 3. MODULO SPONSOR E CONVENZIONI (ANACI Servizi Integrati srl)
-- ============================================================================
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    category partner_category NOT NULL,
    category_label VARCHAR(120) NOT NULL,
    sector VARCHAR(150) NOT NULL,
    referent_name VARCHAR(150),                       -- Referente dedicato ANACI BG (opzionale)
    phone VARCHAR(50) NOT NULL,                       -- Formattato per click-to-call
    email VARCHAR(255),                               -- Nullabile (es. numeri verdi dedicati)
    website_url VARCHAR(255),
    logo_initials VARCHAR(6) NOT NULL,
    badge_convenzione VARCHAR(150) DEFAULT 'Convenzione Ufficiale ANACI BG',
    descrizione_servizi TEXT,
    vantaggi_associati TEXT,                          -- Condizioni riservate agli iscritti ANACI BG
    zone_coperte VARCHAR(255) DEFAULT 'Bergamo e Provincia',
    rating_medio NUMERIC(3,2) DEFAULT 4.80,
    totale_recensioni INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT TRUE,
    owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partners_category ON partners(category);

-- Richieste di Preventivo / Sopralluogo in Convenzione ANACI BG
CREATE TABLE partner_quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id INT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    associate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    studio_name VARCHAR(200) NOT NULL,
    condominio_riferimento VARCHAR(200) NOT NULL,     -- Es. "Condominio Parco Suardi - Via B. Bono, BG"
    indirizzo_condominio VARCHAR(255),
    zona bergamo_zone DEFAULT 'BERGAMO_CITTA',
    numero_unita_immobiliari INT,
    tipo_richiesta VARCHAR(80) NOT NULL,              -- 'PREVENTIVO', 'SOPRALLUOGO_TECNICO', 'VERIFICA_NORMATIVA'
    urgenza urgency_level DEFAULT 'NORMALE',
    note_dettaglio TEXT NOT NULL,
    allegato_capitolato_url TEXT,
    stato VARCHAR(40) DEFAULT 'INVIATA',              -- 'INVIATA', 'PRESA_IN_CARICO', 'PREVENTIVO_EMESSO', 'CHIUSA'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feedback e Recensioni riservate esclusivamente agli Associati Verificati
CREATE TABLE partner_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id INT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    associate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    puntualita_rating INT CHECK (puntualita_rating BETWEEN 1 AND 5),
    rapporto_qualita_prezzo INT CHECK (rapporto_qualita_prezzo BETWEEN 1 AND 5),
    tipo_intervento VARCHAR(150),
    commento_riservato TEXT NOT NULL,
    is_anonymous_to_partner BOOLEAN DEFAULT TRUE,     -- Visibile solo tra colleghi ANACI BG
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. MODULO CONFRONTO: BACHECA "CASI CRITICI & SOS CONDOMINIO" + CENTRO STUDI
-- ============================================================================
CREATE TABLE sos_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN DEFAULT FALSE,               -- Se TRUE, mostra "Associato Verificato #BG-Anonimo"
    anonymous_alias VARCHAR(60),                      -- Es. "Associato Verificato #BG-841"
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    primary_tag VARCHAR(60) NOT NULL,                 -- 'Morosità', 'Infiltrazioni', 'Parti Comuni', 'Superbonus/Bonus Edilizi', 'Distacchi'
    secondary_tags TEXT[],                            -- Array di tag secondari
    zona_condominio bergamo_zone DEFAULT 'BERGAMO_CITTA',
    urgency urgency_level DEFAULT 'NORMALE',
    status ticket_status DEFAULT 'APERTO',
    richiede_parere_centro_studi BOOLEAN DEFAULT FALSE,
    upvotes_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sos_posts_tag ON sos_posts(primary_tag);
CREATE INDEX idx_sos_posts_status ON sos_posts(status);

-- Risposte dei colleghi e Pareri Ufficiali degli Esperti del Centro Studi
CREATE TABLE sos_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES sos_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_official_expert_opinion BOOLEAN DEFAULT FALSE, -- TRUE se emesso da Esperto Centro Studi ANACI BG
    riferimenti_normativi VARCHAR(255),               -- Es. "Art. 1126 c.c. | Cass. Civ. Sez. II n. 35957/2023"
    content TEXT NOT NULL,
    helpful_votes_count INT DEFAULT 0,                -- Contatore "Voto Utile"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella pivot per tracciare il "Voto Utile" univoco per associato
CREATE TABLE sos_reply_votes (
    reply_id UUID NOT NULL REFERENCES sos_replies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reply_id, user_id)
);

-- Sportello Esperti e Centro Studi Provinciale (Ticketing diretto -> FAQ)
CREATE TABLE expert_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocollo VARCHAR(30) UNIQUE NOT NULL,           -- Es. "CS-BG-2026-0148"
    associate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_expert_id UUID REFERENCES users(id) ON DELETE SET NULL,
    area_tematica VARCHAR(80) NOT NULL,               -- 'Legale Civile', 'Fiscale/Tributario', 'Tecnico/Impianti', 'Privacy GDPR'
    quesito_titolo VARCHAR(255) NOT NULL,
    quesito_testo TEXT NOT NULL,
    risposta_ufficiale TEXT,
    pubblicato_in_kb BOOLEAN DEFAULT FALSE,           -- Se TRUE, pubblicato anonimizzato nella Knowledge Base
    status ticket_status DEFAULT 'APERTO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 5. MODULO INTELLIGENZA ARTIFICIALE ("CHIEDI AD ANACI BOT" & TOOL OPERATIVI)
-- ============================================================================
CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    knowledge_scopes TEXT[] DEFAULT ARRAY['CODICE_CIVILE', 'CASSAZIONE', 'COMUNE_BG', 'CENTRO_STUDI', 'STATUTO_ANACI'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('USER', 'ASSISTANT')),
    content TEXT NOT NULL,
    cited_sources JSONB DEFAULT '[]'::jsonb,          -- Array JSON di fonti normative/sentenze citate dal RAG
    generated_artifact_type VARCHAR(60),              -- 'BOZZA_VERBALE', 'DIFFIDA_MOROSITA', 'TABELLA_RIPARTIZIONE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Simulazioni Ripartizione Spese Complessa (Art. 1124, 1126, Supercondominio)
CREATE TABLE expense_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    condominio_nome VARCHAR(200),
    criterio_normativo VARCHAR(60) NOT NULL,          -- 'ART_1126_LASTRICO', 'ART_1124_SCALE_ASCENSORI', 'ART_1123_COMMA_3'
    importo_totale NUMERIC(12,2) NOT NULL,
    parametri_input JSONB NOT NULL,
    risultato_ripartizione JSONB NOT NULL,
    nota_esplicativa_verbale TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. MODULO TERRITORIO BERGAMO, FORMAZIONE DM 140/2014 & SALE ASSEMBLEE
-- ============================================================================
-- Eventi Formativi e Crediti DM 140/2014
CREATE TABLE training_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codice_evento VARCHAR(40) UNIQUE NOT NULL,
    titolo VARCHAR(255) NOT NULL,
    relatori VARCHAR(255) NOT NULL,
    modalita VARCHAR(50) NOT NULL,                    -- 'IN_PRESENZA_BERGAMO', 'WEBINAR_LIVE', 'ON_DEMAND'
    location VARCHAR(255),                            -- Es. "Sede ANACI BG - Via V. Bellini 43"
    data_inizio TIMESTAMP WITH TIME ZONE NOT NULL,
    durata_ore NUMERIC(4,1) NOT NULL,
    crediti_cfp INT NOT NULL,
    posti_disponibili INT DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prenotazione Sala Assemblee Sede ANACI Bergamo (Via Vincenzo Bellini 43) e Sale Convenzionate
CREATE TABLE room_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name VARCHAR(150) NOT NULL,                  -- Es. "Sala Assemblee Sede ANACI BG - Via V. Bellini 43 (Capienza 45)"
    associate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    condominio_assemblea VARCHAR(200) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    partecipanti_stimati INT DEFAULT 20,
    richiede_videoconferenza BOOLEAN DEFAULT TRUE,
    stato VARCHAR(40) DEFAULT 'CONFERMATA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mappa Emergenze Condivise & Radar Bandi Bergamo
CREATE TABLE territorial_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    tipo_alert VARCHAR(60) NOT NULL,                  -- 'EMERGENZA_RETE', 'BANDO_REGIONE_COMUNE', 'ORDINANZA_COMUNE_BG'
    titolo VARCHAR(255) NOT NULL,
    descrizione TEXT NOT NULL,
    ente_coinvolto VARCHAR(120),                      -- 'Uniacque', 'A2A Ciclo Idrico', 'Aprica', 'Comune di Bergamo', 'Regione Lombardia'
    zona bergamo_zone NOT NULL,
    indirizzo_quartiere VARCHAR(200),
    lat NUMERIC(9,6),
    lng NUMERIC(9,6),
    condomini_coinvolti_count INT DEFAULT 1,
    attivo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. MODULO STATUTO, CODICE DEONTOLOGICO E DOCUMENTI ISTITUZIONALI
-- ============================================================================
-- Documenti ufficiali dell'Associazione (Statuto Nazionale/Provinciale, Regolamento, Codice Deontologico)
CREATE TABLE institutional_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,                -- Es. 'statuto-anaci-vigente', 'codice-deontologico'
    tipo_documento VARCHAR(50) NOT NULL,              -- 'STATUTO', 'REGOLAMENTO_ATTUAZIONE', 'CODICE_DEONTOLOGICO'
    titolo VARCHAR(255) NOT NULL,                     -- Es. "Statuto Nazionale e Articolazioni Territoriali ANACI"
    versione VARCHAR(40) NOT NULL,                    -- Es. "Edizione vigente 2024/2026"
    data_approvazione DATE NOT NULL,
    ente_approvazione VARCHAR(150),                   -- Es. "Congresso Nazionale ANACI / Consiglio Provinciale BG"
    descrizione_sintetica TEXT,
    file_pdf_url TEXT,                                -- Link al PDF ufficiale firmato e scaricabile
    is_current BOOLEAN DEFAULT TRUE,                  -- Indica se è la versione attualmente in vigore
    richiede_presa_visione BOOLEAN DEFAULT TRUE,      -- Obbligo di presa visione/accettazione per gli iscritti
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Articoli e Capi dello Statuto (per consultazione interattiva in-app e ricerca rapida/AI)
CREATE TABLE statute_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES institutional_documents(id) ON DELETE CASCADE,
    titolo_sezione VARCHAR(150) NOT NULL,             -- Es. "TITOLO I - Costituzione e Scopi", "TITOLO III - Soci"
    numero_articolo INT NOT NULL,                     -- Es. 1, 2, 3...
    etichetta_articolo VARCHAR(40) NOT NULL,          -- Es. "Art. 1", "Art. 14-bis"
    rubrica VARCHAR(200) NOT NULL,                    -- Titolo dell'articolo (es. "Requisiti di ammissione dei Soci")
    contenuto_testo TEXT NOT NULL,                    -- Testo integrale dell'articolo
    parole_chiave TEXT[],                             -- Tag per ricerca rapida (es. ARRAY['iscrizione', 'quote', 'espulsione'])
    ordine_visualizzazione INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_statute_articles_doc ON statute_articles(document_id, ordine_visualizzazione);

-- Tracciamento Presa Visione e Accettazione dello Statuto da parte dei Soci
CREATE TABLE statute_acknowledgments (
    document_id UUID NOT NULL REFERENCES institutional_documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    version_accepted VARCHAR(40) NOT NULL,
    PRIMARY KEY (document_id, user_id)
);

-- ============================================================================
-- 8. MODULO CALCOLATORE PREVENTIVO STANDARD GESTIONE CONDOMINIO (Art. 1129 c.c.)
-- ============================================================================
-- Parametri tariffari e benchmark standard per la Provincia di Bergamo
CREATE TABLE tariff_benchmarks_bg (
    id SERIAL PRIMARY KEY,
    codice_voce VARCHAR(60) UNIQUE NOT NULL,          -- Es. 'QUOTA_FISSA_BASE', 'SCAGLIONE_UI_1_15', 'MAGG_TELERISCALDAMENTO'
    categoria VARCHAR(50) NOT NULL,                   -- 'COMPENSO_BASE', 'SCAGLIONI_UNITA', 'IMPIANTI_COMPLESSITA', 'ADEMPIMENTI_FISCALI', 'SPESE_VIVE', 'BENCHMARK_SPESE_CONDOMINIO'
    descrizione VARCHAR(200) NOT NULL,
    unita_misura VARCHAR(40) NOT NULL,                -- 'EURO_FISSO', 'EURO_PER_UNITA', 'PERCENTUALE'
    valore_consigliato NUMERIC(10,2) NOT NULL,
    valore_minimo NUMERIC(10,2),
    valore_massimo NUMERIC(10,2),
    riferimento_normativo VARCHAR(120),               -- Es. 'Art. 1129 c. 14 c.c.', 'D.P.R. 322/1998 (Mod. 770/CU)'
    attivo BOOLEAN DEFAULT TRUE
);

-- Preventivi di Gestione Condominiale calcolati e salvati dagli Associati
CREATE TABLE condo_management_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_preventivo VARCHAR(40) UNIQUE NOT NULL,    -- Es. "PREV-BG-2026-0042"
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    condominio_nome VARCHAR(200) NOT NULL,
    indirizzo_condominio VARCHAR(255),
    zona bergamo_zone DEFAULT 'BERGAMO_CITTA',
    
    -- Caratteristiche dimensionali e impiantistiche dello stabile
    unita_principali INT NOT NULL DEFAULT 10,         -- Appartamenti, uffici, negozi
    pertinenze_box_cantine INT NOT NULL DEFAULT 10,   -- Box, posti auto, cantine separate
    scale_palazzine INT NOT NULL DEFAULT 1,
    num_ascensori INT NOT NULL DEFAULT 1,
    riscaldamento_centralizzato BOOLEAN DEFAULT FALSE,
    contabilizzazione_calore_uni10200 BOOLEAN DEFAULT FALSE,
    area_verde_condominiale BOOLEAN DEFAULT FALSE,
    portineria_custode BOOLEAN DEFAULT FALSE,
    supercondominio BOOLEAN DEFAULT FALSE,
    
    -- Regime Fiscale dello Studio
    regime_fiscale VARCHAR(40) DEFAULT 'ORDINARIO_IVA', -- 'ORDINARIO_IVA', 'FORFETTARIO_ESENTE'
    cassa_previdenziale_pct NUMERIC(4,2) DEFAULT 4.00,  -- 4% Cassa / Rivalsa INPS
    aliquota_iva_pct NUMERIC(4,2) DEFAULT 22.00,
    
    -- Risultati Calcolo Compenso Amministratore (ex Art. 1129 c. 14 c.c.)
    compenso_base_annuo NUMERIC(10,2) NOT NULL,       -- Quota fissa + quota unità immobiliari + pertinenze
    maggiorazione_impianti NUMERIC(10,2) NOT NULL,    -- Maggiorazione complessità tecnica/impiantistica
    compenso_adempimenti_fiscali NUMERIC(10,2) NOT NULL, -- Mod. 770, CU, Quadro AC/K, Conservazione sostitutiva
    rimborso_spese_forfettario NUMERIC(10,2) NOT NULL,-- Cancelleria, postali, tenuta conto/software
    totale_imponibile_studio NUMERIC(10,2) NOT NULL,
    totale_lordo_annuo_studio NUMERIC(10,2) NOT NULL, -- Comprensivo di Cassa/INPS e IVA
    costo_mensile_per_unita NUMERIC(8,2) NOT NULL,    -- Incidenza media € / mese per unità principale
    
    -- Stima Opzionale Budget Spese Ordinarie dell'intero Condominio (Benchmark Bergamo)
    stima_budget_ordinario_condominio JSONB DEFAULT '{}'::jsonb, -- Pulizie, Luce, Ascensore, Assicurazione, Riscaldamento
    dettaglio_voci_json JSONB NOT NULL,               -- Breakdown completo di tutte le voci e tariffe extra/assemblee
    testo_proposta_mandato TEXT NOT NULL,             -- Bozza pronta ex Art. 1129 c. 14 c.c. da stampare/allegare al verbale
    
    stato VARCHAR(30) DEFAULT 'BOZZA',                -- 'BOZZA', 'INVIATO_ASSEMBLEA', 'ACCETTATO', 'ARCHIVIATO'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_condo_quotes_user ON condo_management_quotes(user_id);

-- ============================================================================
-- 9. MODULO ASSEMBLEA SOCI, ACCREDITAMENTO QR CODE & VOTAZIONI ELETTRONICHE
-- ============================================================================
-- Sessioni Assembleari / Convegni Istituzionali dei Soci ANACI Bergamo
CREATE TABLE member_assemblies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codice_assemblea VARCHAR(40) UNIQUE NOT NULL,     -- Es. "ASS-BG-2026-ORD01"
    titolo VARCHAR(255) NOT NULL,                     -- Es. "Assemblea Ordinaria ed Elettiva dei Soci ANACI Bergamo"
    convocazione_tipo VARCHAR(40) NOT NULL,           -- 'ORDINARIA_ANNUALE', 'ELETTIVA_QUADRIENNALE', 'STRAORDINARIA'
    data_assemblea TIMESTAMP WITH TIME ZONE NOT NULL,
    location_fisica VARCHAR(255) NOT NULL,            -- Es. "Centro Congressi Giovanni XXIII / Sede Via V. Bellini 43, BG"
    link_streaming_online VARCHAR(255),
    qr_code_ingresso_token VARCHAR(120) UNIQUE NOT NULL, -- Token codificato nel QR esposto all'ingresso del convegno
    qr_code_online_token VARCHAR(120) UNIQUE NOT NULL,   -- Token codificato nel QR pubblicato in sovraimpressione online
    cfp_riconosciuti INT DEFAULT 3,                   -- Crediti formativi riconosciuti ai partecipanti accreditati
    totale_soci_aventi_diritto INT DEFAULT 320,
    quorum_richiesto INT DEFAULT 107,
    stato VARCHAR(30) DEFAULT 'IN_CORSO',             -- 'CONVOCATA', 'ACCREDITAMENTO_APERTO', 'IN_CORSO', 'CONCLUSA'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accreditamento dei Soci tramite scansione QR Code (Ingresso Convegno o Pubblicato Online)
CREATE TABLE assembly_accreditations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assembly_id UUID NOT NULL REFERENCES member_assemblies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    modalita_accredito VARCHAR(40) NOT NULL,          -- 'QR_INGRESSO_CONVEGNO', 'QR_PUBBLICATO_ONLINE'
    qr_token_utilizzato VARCHAR(120) NOT NULL,
    quota_associativa_regolare BOOLEAN DEFAULT TRUE,  -- Verifica Art. 4 e Art. 7 Statuto
    cfp_dm140_regolari BOOLEAN DEFAULT TRUE,
    deleghe_codici_soci TEXT[] DEFAULT ARRAY[]::TEXT[], -- Codici soci deleganti (max 2 deleghe)
    peso_voto_totale INT NOT NULL DEFAULT 1,          -- 1 (voto proprio) + numero deleghe validate
    codice_badge_accredito VARCHAR(50) UNIQUE NOT NULL, -- Es. "ACC-BG26-1042"
    accredited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (assembly_id, user_id)
);

CREATE INDEX idx_assembly_accred_assembly ON assembly_accreditations(assembly_id);

-- Votazioni / Punti all'Ordine del Giorno dell'Assemblea Soci
CREATE TABLE assembly_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assembly_id UUID NOT NULL REFERENCES member_assemblies(id) ON DELETE CASCADE,
    numero_punto_odg INT NOT NULL,
    titolo_votazione VARCHAR(255) NOT NULL,
    descrizione_quesito TEXT NOT NULL,
    tipo_scrutinio VARCHAR(40) NOT NULL,              -- 'VOTO_PALESE_BILANCIO', 'SCRUTINIO_SEGRETO_CARICHE', 'MOZIONE_DELIBERA'
    max_preferenze INT DEFAULT 1,                     -- 1 per voto secco (Favorevole/Contrario/Astenuto), >1 per elezione consiglieri
    opzioni_json JSONB NOT NULL,                      -- Array opzioni o candidati [{id, label, subLabel, votes}]
    stato_votazione VARCHAR(30) DEFAULT 'APERTA',     -- 'APERTA', 'CHIUSA', 'APPROVATA'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Registro Voti Espressi dai Soci Accreditati (con ricevuta crittografata)
CREATE TABLE assembly_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES assembly_polls(id) ON DELETE CASCADE,
    accreditation_id UUID NOT NULL REFERENCES assembly_accreditations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scelte_espresse TEXT[] NOT NULL,                  -- ID delle opzioni/candidati votati
    peso_voto_applicato INT NOT NULL DEFAULT 1,       -- Comprensivo di eventuali deleghe accreditate
    modalita_presenza VARCHAR(40) NOT NULL,           -- 'QR_INGRESSO_CONVEGNO' o 'QR_PUBBLICATO_ONLINE'
    ricevuta_hash VARCHAR(80) UNIQUE NOT NULL,        -- Hash di verifica crittografica del voto
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (poll_id, user_id)
);



