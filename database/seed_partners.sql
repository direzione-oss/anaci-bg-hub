-- ============================================================================
-- ANACI BG HUB - POPOLAMENTO INIZIALE TABELLA `partners` (21 Fornitori Ufficiali)
-- ANACI Servizi Integrati srl - Sezione Provinciale di Bergamo
-- ============================================================================

INSERT INTO partners (
    id, slug, company_name, category, category_label, sector,
    referent_name, phone, email, logo_initials,
    badge_convenzione, descrizione_servizi, vantaggi_associati, zone_coperte, rating_medio, totale_recensioni
) VALUES
-- CATEGORIA 1: Energia Elettrica, Gas e Contabilizzazione Calore (1-6)
(1, 'bergamo-gas-e-luce', 'Bergamo Gas e Luce', 'ENERGIA_CALORE', 'Energia Elettrica, Gas e Contabilizzazione Calore',
 'Energia elettrica e gas', 'Ilario Centimerio', '342 1623550', 'ilario.centimerio@bergamogaseluce.it', 'BGL',
 'Partner Territoriale ANACI BG', 'Fornitura energia elettrica e gas naturale dedicata ai condomini amministrati in provincia di Bergamo con sportello dedicato agli studi.',
 'Tariffe indicizzate PUN/PSV agevolate, check-up gratuito fatture condominiali e gestione volture prioritaria.', 'Bergamo Città e Provincia', 4.90, 34),

(2, 'dts-srl', 'DTS Srl', 'ENERGIA_CALORE', 'Energia Elettrica, Gas e Contabilizzazione Calore',
 'Energia elettrica e gas', 'Gianluca Piro', '339 5809660', 'gianluca.piro@dtssrl.com', 'DTS',
 'Convenzione ANACI Servizi', 'Consulenza energetica multi-pod e fornitura gas/luce per centrali termiche condominiali e supercondomini.',
 'Analisi comparativa costi energetici gratuita e referente unico per l''amministratore.', 'Bergamo e Provincia', 4.80, 22),

(3, 'energy-up', 'Energy Up', 'ENERGIA_CALORE', 'Energia Elettrica, Gas e Contabilizzazione Calore',
 'Energia elettrica e gas', NULL, '800 567567', 'servizioclienti@energy-up.it', 'EUP',
 'Convenzione ANACI Servizi', 'Soluzioni di fornitura energetica ed efficientamento per edifici residenziali e terziari.',
 'Numero verde dedicato agli studi associati e portale multi-condominio per scarico massivo fatture XML/PDF.', 'Intera Provincia di Bergamo', 4.75, 19),

(4, 'simecom', 'Simecom', 'ENERGIA_CALORE', 'Energia Elettrica, Gas e Contabilizzazione Calore',
 'Energia elettrica e gas', 'Alessandro Gallo', '348 5342800', 'alessandro.gallo@simecom.it', 'SIM',
 'Partner Storico Lombardia', 'Fornitura gas metano ed energia elettrica con presenza capillare sul territorio bergamasco e lombardo.',
 'Condizioni economiche riservate ANACI BG e supporto diretto per subentri, nuove attivazioni e pratiche accise agevolate.', 'Bergamo, Bassa Bergamasca, Isola', 4.85, 29),

(5, 'promax-energia', 'Promax Energia', 'ENERGIA_CALORE', 'Energia Elettrica, Gas e Contabilizzazione Calore',
 'Energia elettrica e gas', 'Gregory Airopetyan', '338 6097174', 'direzione@promaxenergia.com', 'PMX',
 'Convenzione ANACI Servizi', 'Brokeraggio e fornitura energetica ad alto valore aggiunto per grandi complessi condominiali.',
 'Report previsionale di spesa per bilancio preventivo condominiale incluso nel servizio.', 'Bergamo e Provincia', 4.80, 17),

(6, 'infinity-control-service', 'Infinity Control Service', 'ENERGIA_CALORE', 'Energia Elettrica, Gas e Contabilizzazione Calore',
 'Contabilizzazione del calore', NULL, '035 0433829', 'info@infinitycontrolservice.com', 'ICS',
 'Specialista UNI 10200', 'Sistemi di termoregolazione, telelettura ripartitori, contabilizzazione diretta/indiretta del calore e progetti UNI 10200.',
 'Sopralluogo tecnico in centrale termica gratuito e consegna prospetti di riparto compatibili con i principali gestionali (Danea, Kubik, Pigreco).', 'Bergamo Città, Val Seriana, Val Brembana', 4.92, 41),

-- CATEGORIA 2: Impianti, Manutenzione, Sicurezza e Certificazioni (7-12)
(7, 'duelle-lift', 'Duelle Lift', 'IMPIANTI_SICUREZZA', 'Impianti, Manutenzione, Sicurezza e Certificazioni',
 'Ascensori', 'Stefano Pegorari', '335 1227655', 'stefano.pegorari@duellelift.com', 'DLL',
 'Partner Tecnico Ascensori', 'Installazione, manutenzione ordinaria/straordinaria e ammodernamento impianti ascensori, montascale e piattaforme elevatrici.',
 'Pronto intervento H24 garantito e sconto riservato sui canoni di manutenzione e adeguamento barriere architettoniche.', 'Bergamo e Provincia', 4.95, 38),

(8, 'idromac', 'IDROMAC', 'IMPIANTI_SICUREZZA', 'Impianti, Manutenzione, Sicurezza e Certificazioni',
 'Idraulica', NULL, '0363 760086', 'idromac@gmail.com', 'IDR',
 'Pronto Intervento Idraulico', 'Manutenzione impianti idrosanitari condominiali, ricerca perdite non distruttiva, autoclavi e colonne di scarico.',
 'Uscita prioritaria per rotture tubazioni e infiltrazioni urgenti nei condomini amministrati da associati ANACI BG.', 'Bassa Bergamasca, Bergamo Città, Isola', 4.85, 27),

(9, 'crotti-safety', 'Crotti Safety', 'IMPIANTI_SICUREZZA', 'Impianti, Manutenzione, Sicurezza e Certificazioni',
 'Antincendio', NULL, '035 6304701', 'info@crottisafety.it', 'CRS',
 'Sicurezza Antincendio BG', 'Manutenzione presidi antincendio (estintori, idranti, porte REI), pratiche CPI/SCIA VVF e adeguamenti D.M. 25/01/2019 per facciate e autorimesse.',
 'Check-up normativo autorimesse condominiali e registro antincendio digitale condiviso con lo studio.', 'Bergamo e Provincia', 4.90, 33),

(10, 'rear-gsa', 'Rear GSA (Gruppo Rear)', 'IMPIANTI_SICUREZZA', 'Impianti, Manutenzione, Sicurezza e Certificazioni',
 'Antincendio', NULL, '035 344509', 'amministrazione@grupporear.it', 'RGR',
 'Convenzione Antincendio & GSA', 'Servizi integrati di sicurezza antincendio, Gestione Sicurezza Antincendio (GSA), sorveglianza e manutenzione impianti.',
 'Tariffario agevolato per verifiche semestrali UNI 9994-1 e consulenza tecnica per rinnovo periodico conformità antincendio.', 'Bergamo e Provincia', 4.82, 24),

(11, 'sonzogni-sintesi', 'Sonzogni Sintesi', 'IMPIANTI_SICUREZZA', 'Impianti, Manutenzione, Sicurezza e Certificazioni',
 'Dispositivi anticaduta e linee vita', NULL, '035 0448433', 'info@sonzognisintesi.it', 'SNZ',
 'Sicurezza Coperture & Linee Vita', 'Progettazione, installazione e revisione periodica di linee vita e dispositivi anticaduta su coperture condominiali (Normativa Regione Lombardia).',
 'Verifica documentale Fascicolo Tecnico della copertura e scontistica su collaudi annuali obbligatori.', 'Bergamo Città, Città Alta, Valli Bergamasche', 4.94, 36),

(12, 'csdm', 'CSDM', 'IMPIANTI_SICUREZZA', 'Impianti, Manutenzione, Sicurezza e Certificazioni',
 'Ente di Certificazione e Ispezione', NULL, '02 56816188', 'info@csdm.it', 'CSD',
 'Organismo Notificato & Ispezioni', 'Verifiche periodiche impianti di messa a terra (DPR 462/01), verifiche ascensori (DPR 162/99), cancelli motorizzati e analisi acque/Legionella.',
 'Pianificazione automatica scadenze biennali/quinquennali per l''intero parco condomini dello studio con tariffe in convenzione.', 'Bergamo e Lombardia', 4.88, 45),

-- CATEGORIA 3: Pulizie, Disinfestazione e Servizi al Condominio (13-18)
(13, 'life-srl', 'Life Srl', 'PULIZIE_MULTISERVIZI', 'Pulizie, Disinfestazione e Servizi al Condominio',
 'Pulizie condominiali', NULL, '039 5781260', 'lifesrlbergamo@gmail.com', 'LIF',
 'Convenzione Pulizie & Igiene', 'Pulizia ordinaria e straordinaria parti comuni, rotazione sacchi/bidoni raccolta differenziata, lavaggio vetrate e trattamento pavimentazioni.',
 'Sopralluogo di quotazione entro 48h e primo intervento di sanificazione o sgrosso a tariffa agevolata.', 'Bergamo, Isola Bergamasca, Dalmine', 4.80, 21),

(14, 'mocit', 'MOCIT', 'PULIZIE_MULTISERVIZI', 'Pulizie, Disinfestazione e Servizi al Condominio',
 'Disinfestazione e derattizzazione', NULL, '035 212011', 'info@mocit.it', 'MOC',
 'Igiene Ambientale Certificata', 'Interventi di derattizzazione, disinfestazione zanzare/blatte/vespe, allontanamento volatili (piccioni in Città Alta e centro storico) e disinfezione.',
 'Monitoraggio annuale con reportistica fotografica degli erogatori e intervento rapido su chiamata.', 'Bergamo Città, Città Alta e Provincia', 4.91, 39),

(15, 'cmc-multiservice', 'CMC (Multiservice Condominio)', 'PULIZIE_MULTISERVIZI', 'Pulizie, Disinfestazione e Servizi al Condominio',
 'Multiservizi', NULL, '035 0390611', 'info@multiservicecondominio.it', 'CMC',
 'Partner Multiservizi Condominio', 'Manutenzione aree verdi e giardini condominiali, sgombero neve/spargisale, piccole manutenzioni edili/fabbrili e sostituzione corpi illuminanti LED.',
 'Contratto quadro multiservizio personalizzabile per ridurre il numero di fornitori da gestire.', 'Bergamo e Provincia', 4.86, 31),

(16, 'soquick', 'SoQuick', 'PULIZIE_MULTISERVIZI', 'Pulizie, Disinfestazione e Servizi al Condominio',
 'Servizi per condomini', 'Nadia Domanico', '344 0414389', 'nadia.domanico@soquick.it', 'SOQ',
 'Gestione Rapida Interventi', 'Servizi operativi rapidi per l''edificio, gestione guasti parti comuni e assistenza logistica dedicata agli studi di amministrazione.',
 'Referente diretto dedicato (Nadia Domanico) per attivazione immediata interventi.', 'Bergamo e Provincia', 4.84, 25),

(17, 'tresessanta-group', 'Tresessanta Group', 'PULIZIE_MULTISERVIZI', 'Pulizie, Disinfestazione e Servizi al Condominio',
 'Servizi per condomini', NULL, '035 0086961', 'backoffice@tresessanta.com', '360',
 'Global Service Condominiale', 'Facility management a 360° per stabili residenziali, direzionali e supercondomini sul territorio di Bergamo.',
 'Backoffice dedicato per tracciamento ordini di lavoro e rendicontazione puntuale per l''assemblea.', 'Bergamo e Provincia', 4.87, 28),

(18, 'very-fast-people', 'Very Fast People', 'PULIZIE_MULTISERVIZI', 'Pulizie, Disinfestazione e Servizi al Condominio',
 'Servizi per condomini', NULL, '800 035452', NULL, 'VFP',
 'Partner Nazionale ANACI', 'Servizi esternalizzati e consulenza specialistica per gli amministratori di condominio (front-office, gestione sinistri, servizi tecnici e amministrativi).',
 'Accesso alle condizioni quadro riservate agli associati ANACI tramite Numero Verde dedicato.', 'Bergamo e Nazionale', 4.89, 52),

-- CATEGORIA 4: Servizi per lo Studio, Fisco e Recupero Crediti (19-21)
(19, 'servizio-unico', 'Servizio Unico', 'STUDIO_FISCO_CREDITI', 'Servizi per lo Studio, Fisco e Recupero Crediti',
 'Consulenza fiscale', NULL, '035 794335', 'info@serviziounico.it', 'SVU',
 'Partner Fiscale & 770/CU', 'Elaborazione Modello 770 condominiale, Certificazioni Uniche (CU), pratiche detrazioni fiscali (ristrutturazioni/ecobonus), quadro AC/K e consulenza tributaria.',
 'Tariffe a forfait per condominio convenzionate ANACI BG e importazione diretta flussi dai gestionali Danea Domustudio, Kubik e Pigreco.', 'Bergamo e Provincia', 4.96, 48),

(20, 'studio-tj', 'Studio TJ', 'STUDIO_FISCO_CREDITI', 'Servizi per lo Studio, Fisco e Recupero Crediti',
 'Recupero del credito', NULL, '035 4139438', 'info@studiotj.it', 'STJ',
 'Tutela Crediti Condominiali', 'Gestione stragiudiziale e supporto per il recupero crediti verso condomini morosi (ex art. 63 disp. att. c.c.), visure patrimoniali e rintraccio eredi.',
 'Pre-analisi di solvibilità gratuita sul condomino moroso prima di avviare il decreto ingiuntivo.', 'Foro di Bergamo e Lombardia', 4.90, 35),

(21, 'tutto-ufficio', 'Tutto Ufficio', 'STUDIO_FISCO_CREDITI', 'Servizi per lo Studio, Fisco e Recupero Crediti',
 'Forniture e servizi per l''amministratore', NULL, '02 9092683', 'info@tutto-ufficio.it', 'TUF',
 'Forniture & Print Studio', 'Fornitura cancelleria, stampanti multifunzione noleggio operativo, imbustamento/postalizzazione convocazioni assembleari e archiviazione digitale.',
 'Listino scontato riservato agli studi ANACI BG e consegna rapida presso lo studio.', 'Bergamo e Lombardia', 4.81, 20);
