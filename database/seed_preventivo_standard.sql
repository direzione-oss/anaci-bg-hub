-- ============================================================================
-- ANACI BG HUB - PARAMETRI STANDARD CALCOLO PREVENTIVO GESTIONE CONDOMINIO
-- Riferimenti operativi e benchmark medi per Bergamo e Provincia (Art. 1129 c.c.)
-- ============================================================================

INSERT INTO tariff_benchmarks_bg (
    codice_voce, categoria, descrizione, unita_misura,
    valore_consigliato, valore_minimo, valore_massimo, riferimento_normativo
) VALUES
-- 1. COMPENSO BASE E SCAGLIONI UNITA' IMMOBILIARI (Emolumento Ordinario Annuo)
('QUOTA_FISSA_STUDIO', 'COMPENSO_BASE', 'Quota fissa annua di apertura e tenuta gestione condominiale', 'EURO_FISSO', 450.00, 350.00, 650.00, 'Art. 1129 c. 14 c.c. - Gestione base'),
('SCAGLIONE_UI_FINO_15', 'SCAGLIONI_UNITA', 'Tariffa annua per unità principale (appartamento/negozio/ufficio) da 1 a 15 u.i.', 'EURO_PER_UNITA', 95.00, 80.00, 120.00, 'Art. 1129 c. 14 c.c.'),
('SCAGLIONE_UI_16_40', 'SCAGLIONI_UNITA', 'Tariffa annua per unità principale da 16 a 40 u.i.', 'EURO_PER_UNITA', 80.00, 65.00, 100.00, 'Art. 1129 c. 14 c.c.'),
('SCAGLIONE_UI_OLTRE_40', 'SCAGLIONI_UNITA', 'Tariffa annua per unità principale oltre 40 u.i.', 'EURO_PER_UNITA', 68.00, 55.00, 85.00, 'Art. 1129 c. 14 c.c.'),
('QUOTA_PERTINENZA_BOX', 'SCAGLIONI_UNITA', 'Tariffa annua per pertinenza separata (box, posto auto, cantina autonoma)', 'EURO_PER_UNITA', 18.00, 12.00, 28.00, 'Art. 1129 c. 14 c.c.'),

-- 2. MAGGIORAZIONI PER IMPIANTI E COMPLESSITA' DELLO STABILE
('MAGG_SCALA_EXTRA', 'IMPIANTI_COMPLESSITA', 'Maggiorazione per ogni scala/corpo di fabbrica oltre il primo (gestione tabelle separate Art. 1123 c. 3)', 'EURO_FISSO', 150.00, 100.00, 250.00, 'Art. 1123 c. 3 c.c.'),
('MAGG_ASCENSORE', 'IMPIANTI_COMPLESSITA', 'Gestione amministrativa e scadenze verifiche biennali DPR 162/99 per ogni impianto ascensore', 'EURO_FISSO', 120.00, 80.00, 180.00, 'D.P.R. 162/1999 e Art. 1124 c.c.'),
('MAGG_RISC_CENTRALIZZATO', 'IMPIANTI_COMPLESSITA', 'Gestione centrale termica, terzo responsabile e forniture combustibile', 'EURO_FISSO', 280.00, 200.00, 450.00, 'D.P.R. 74/2013'),
('MAGG_CONTABILIZZAZIONE_UNI10200', 'IMPIANTI_COMPLESSITA', 'Elaborazione riparto consumi volontari/involontari riscaldamento e acqua calda (UNI 10200)', 'EURO_PER_UNITA', 12.00, 8.00, 20.00, 'D.Lgs. 102/2014 - Norma UNI 10200'),
('MAGG_AREA_VERDE', 'IMPIANTI_COMPLESSITA', 'Gestione contratti manutenzione parco/giardino condominiale', 'EURO_FISSO', 110.00, 70.00, 180.00, 'Art. 1117 c.c.'),
('MAGG_PORTINERIA_CUSTODE', 'IMPIANTI_COMPLESSITA', 'Gestione amministrativa rapporto di lavoro portiere/custode e adempimenti consulente del lavoro', 'EURO_FISSO', 420.00, 300.00, 600.00, 'CCNL Proprietari Fabbricati'),
('MAGG_SUPERCONDOMINIO', 'IMPIANTI_COMPLESSITA', 'Coordinamento e partecipazione assemblee di Supercondominio (Art. 1117-bis c.c.)', 'EURO_FISSO', 250.00, 150.00, 400.00, 'Art. 1117-bis e 67 disp. att. c.c.'),

-- 3. ADEMPIMENTI FISCALI E NORMATIVI OBBLIGATORI
('FISC_MOD_770_BASE', 'ADEMPIMENTI_FISCALI', 'Predisposizione e invio telematico Modello 770 Condominiale', 'EURO_FISSO', 180.00, 140.00, 250.00, 'D.P.R. 322/1998'),
('FISC_CERTIFICAZIONE_UNICA', 'ADEMPIMENTI_FISCALI', 'Elaborazione, invio e consegna Certificazioni Uniche (forfait medio annuo)', 'EURO_FISSO', 120.00, 80.00, 200.00, 'D.P.R. 322/1998'),
('FISC_QUADRO_AC_K', 'ADEMPIMENTI_FISCALI', 'Dati per compilazione Quadro AC / K fornitori condominiali e tenuta Anagrafe Condominiale', 'EURO_FISSO', 110.00, 80.00, 160.00, 'Art. 1130 n. 6 c.c.'),

-- 4. RIMBORSO SPESE VIVE E PRESTAZIONI ACCESSORIE / STRAORDINARIE (ex Art. 1129 c. 14 c.c.)
('SPESE_CANCELLERIA_SOFTWARE_UI', 'SPESE_VIVE', 'Forfait annuo cancelleria, archiviazione digitale e portale web per unità principale', 'EURO_PER_UNITA', 14.00, 10.00, 22.00, 'Art. 1129 c. 14 c.c.'),
('EXTRA_ASSEMBLEA_STRAORDINARIA', 'PRESTAZIONI_EXTRA', 'Compenso per ogni Assemblea Straordinaria oltre a quella ordinaria annuale', 'EURO_FISSO', 220.00, 150.00, 350.00, 'Art. 1129 c. 14 c.c.'),
('EXTRA_LAVORI_STRAORDINARI_PCT', 'PRESTAZIONI_EXTRA', 'Compenso amministrativo per gestione lavori straordinari (% sull''importo deliberato)', 'PERCENTUALE', 2.50, 1.50, 4.00, 'Art. 1129 c. 14 e Art. 1135 c.c.'),
('EXTRA_SOLLECITO_MOROSITA', 'PRESTAZIONI_EXTRA', 'Addebito individuale per diffida/messa in mora condomino moroso (oltre spese postali)', 'EURO_FISSO', 25.00, 15.00, 40.00, 'Art. 63 disp. att. c.c.'),
('EXTRA_PASSAGGIO_CONSEGNE', 'PRESTAZIONI_EXTRA', 'Subentro, quadratura contabile iniziale o passaggio di consegne', 'EURO_FISSO', 250.00, 150.00, 400.00, 'Art. 1129 c. 8 c.c.'),

-- 5. BENCHMARK COSTI MEDI GESTIONE ORDINARIA STABILE (Provincia di Bergamo)
('BENCH_PULIZIA_PARTI_COMUNI_UI', 'BENCHMARK_SPESE_CONDOMINIO', 'Stima costo medio annuo pulizia scale e rotazione sacchi per unità', 'EURO_PER_UNITA', 145.00, 110.00, 200.00, 'Benchmark Partner ANACI BG'),
('BENCH_LUCE_ACQUA_COMUNE_UI', 'BENCHMARK_SPESE_CONDOMINIO', 'Stima costo medio annuo energia elettrica parti comuni e acqua per unità', 'EURO_PER_UNITA', 95.00, 70.00, 140.00, 'Benchmark Partner ANACI BG'),
('BENCH_ASSICURAZIONE_FABBRICATO_UI', 'BENCHMARK_SPESE_CONDOMINIO', 'Stima premio medio annuo Polizza Globale Fabbricati per unità', 'EURO_PER_UNITA', 110.00, 85.00, 150.00, 'Benchmark Mercato BG'),
('BENCH_MANUTENZIONE_ASCENSORE', 'BENCHMARK_SPESE_CONDOMINIO', 'Stima canone annuo manutenzione ordinaria, linea GSM e verifiche per ascensore', 'EURO_FISSO', 1250.00, 950.00, 1650.00, 'Benchmark Partner ANACI BG'),
('BENCH_RISCALDAMENTO_CENTR_UI', 'BENCHMARK_SPESE_CONDOMINIO', 'Stima media annua combustibile e terzo responsabile per unità (zona climatica E - Bergamo)', 'EURO_PER_UNITA', 920.00, 680.00, 1300.00, 'Zona Climatica E - Prov. BG');
