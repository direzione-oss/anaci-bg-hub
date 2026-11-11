import { CondoQuoteInput, CondoQuoteLineItem, CondoQuoteResult } from '../types';

/**
 * Parametri Standard di Riferimento ANACI Bergamo per il calcolo:
 * 1) Compenso Analitico Amministratore (ex Art. 1129 comma 14 c.c. e Legge 4/2013)
 * 2) Stima Preventivo Spese di Gestione Ordinaria dello Stabile (Benchmark Prov. Bergamo)
 */
export const DEFAULT_TARIFF_BENCHMARKS_BG = {
  quotaFissaStudio: 450,
  scaglioneUiFino15: 95,
  scaglioneUi16A40: 80,
  scaglioneUiOltre40: 68,
  quotaPertinenzaBox: 18,
  maggScalaExtra: 150,
  maggAscensore: 120,
  maggRiscCentralizzato: 280,
  maggContabilizzazioneUni10200PerUi: 12,
  maggAreaVerde: 110,
  maggPortineriaCustode: 420,
  maggSupercondominio: 250,
  fiscMod770: 180,
  fiscCertificazioneUnica: 120,
  fiscQuadroAcAnagrafe: 110,
  speseCancelleriaSoftwarePerUi: 14,
  extraPassaggioConsegne: 250,
  extraAssembleaStraordinaria: 220,
  extraLavoriStraordinariPct: 2.5,
  extraSollecitoMorosita: 25,
  // Benchmark costi annui condominiali (Bergamo e Provincia)
  benchPuliziaPerUi: 145,
  benchLuceAcquaPerUi: 95,
  benchAssicurazionePerUi: 110,
  benchAscensoreAnnuo: 1250,
  benchRiscaldamentoCentrPerUi: 920,
  benchManutenzioneBasePerUi: 85,
  benchManutenzioneVerdeFisso: 950,
};

/**
 * Calcola il Preventivo Standard della Gestione del Condominio:
 * - Compenso analitico dello Studio a scaglioni progressivi (ex Art. 1129 c. 14 c.c.)
 * - Stima del Budget Ordinario Annuo dell'intero condominio
 * - Bozza formale della Proposta di Mandato Professionale pronta per l'Assemblea
 */
export function calculateStandardCondoQuote(
  input: CondoQuoteInput,
  studioName = 'Studio Associato ANACI Bergamo',
  codiceAssociato = 'BG-1042'
): CondoQuoteResult {
  const t = DEFAULT_TARIFF_BENCHMARKS_BG;
  const ui = Math.max(1, input.unitaPrincipali);
  const pert = Math.max(0, input.pertinenzeBoxCantine);
  const scale = Math.max(1, input.scalePalazzine);
  const ascensori = Math.max(0, input.numAscensori);

  const vociAnalitiche: CondoQuoteLineItem[] = [];

  // 1. COMPENSO BASE STUDIO E SCAGLIONI PROGRESSIVI UNITA' IMMOBILIARI
  vociAnalitiche.push({
    codice: 'QUOTA_FISSA_STUDIO',
    categoria: 'COMPENSO_BASE',
    descrizione: 'Quota fissa annua di impianto contabile, rappresentanza legale e tenuta registri (Art. 1130 c.c.)',
    quantita: 1,
    importoUnitario: t.quotaFissaStudio,
    totaleVoce: t.quotaFissaStudio,
    riferimentoNormativo: 'Art. 1129 c. 14 e Art. 1130 c.c.',
  });

  const uiScaglione1 = Math.min(ui, 15);
  const uiScaglione2 = ui > 15 ? Math.min(ui - 15, 25) : 0;
  const uiScaglione3 = ui > 40 ? ui - 40 : 0;

  if (uiScaglione1 > 0) {
    vociAnalitiche.push({
      codice: 'SCAGLIONE_UI_1_15',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione ordinaria unità principali (1° scaglione: da 1 a 15 u.i.)',
      quantita: uiScaglione1,
      importoUnitario: t.scaglioneUiFino15,
      totaleVoce: uiScaglione1 * t.scaglioneUiFino15,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }

  if (uiScaglione2 > 0) {
    vociAnalitiche.push({
      codice: 'SCAGLIONE_UI_16_40',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione ordinaria unità principali (2° scaglione: da 16 a 40 u.i.)',
      quantita: uiScaglione2,
      importoUnitario: t.scaglioneUi16A40,
      totaleVoce: uiScaglione2 * t.scaglioneUi16A40,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }

  if (uiScaglione3 > 0) {
    vociAnalitiche.push({
      codice: 'SCAGLIONE_UI_OLTRE_40',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione ordinaria unità principali (3° scaglione: oltre 40 u.i.)',
      quantita: uiScaglione3,
      importoUnitario: t.scaglioneUiOltre40,
      totaleVoce: uiScaglione3 * t.scaglioneUiOltre40,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }

  if (pert > 0) {
    vociAnalitiche.push({
      codice: 'QUOTA_PERTINENZA_BOX',
      categoria: 'COMPENSO_BASE',
      descrizione: 'Gestione pertinenze separate (box, autorimesse, posti auto)',
      quantita: pert,
      importoUnitario: t.quotaPertinenzaBox,
      totaleVoce: pert * t.quotaPertinenzaBox,
      riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
    });
  }

  // 2. MAGGIORAZIONI IMPIANTI E COMPLESSITA' TECNICA
  const scaleExtra = Math.max(0, scale - 1);
  if (scaleExtra > 0) {
    vociAnalitiche.push({
      codice: 'MAGG_SCALA_EXTRA',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione contabilità separata per scale/palazzine aggiuntive (condominio parziale)',
      quantita: scaleExtra,
      importoUnitario: t.maggScalaExtra,
      totaleVoce: scaleExtra * t.maggScalaExtra,
      riferimentoNormativo: 'Art. 1123 c. 3 c.c.',
    });
  }

  if (ascensori > 0) {
    vociAnalitiche.push({
      codice: 'MAGG_ASCENSORE',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione contratti impianti elevatori e verifiche periodiche DPR 162/99',
      quantita: ascensori,
      importoUnitario: t.maggAscensore,
      totaleVoce: ascensori * t.maggAscensore,
      riferimentoNormativo: 'Art. 1124 c.c. e D.P.R. 162/1999',
    });
  }

  if (input.riscaldamentoCentralizzato) {
    vociAnalitiche.push({
      codice: 'MAGG_RISC_CENTRALIZZATO',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione centrale termica, terzo responsabile e contratti fornitura energia/gas',
      quantita: 1,
      importoUnitario: t.maggRiscCentralizzato,
      totaleVoce: t.maggRiscCentralizzato,
      riferimentoNormativo: 'D.P.R. 74/2013',
    });
  }

  if (input.contabilizzazioneCaloreUni10200) {
    vociAnalitiche.push({
      codice: 'MAGG_CONTABILIZZAZIONE_UNI10200',
      categoria: 'IMPIANTI',
      descrizione: 'Elaborazione riparto letture consumi volontari/involontari ex UNI 10200',
      quantita: ui,
      importoUnitario: t.maggContabilizzazioneUni10200PerUi,
      totaleVoce: ui * t.maggContabilizzazioneUni10200PerUi,
      riferimentoNormativo: 'D.Lgs. 102/2014 - UNI 10200',
    });
  }

  if (input.areaVerdeCondominiale) {
    vociAnalitiche.push({
      codice: 'MAGG_AREA_VERDE',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione appalti manutenzione giardino/parco condominiale',
      quantita: 1,
      importoUnitario: t.maggAreaVerde,
      totaleVoce: t.maggAreaVerde,
      riferimentoNormativo: 'Art. 1117 c.c.',
    });
  }

  if (input.portineriaCustode) {
    vociAnalitiche.push({
      codice: 'MAGG_PORTINERIA_CUSTODE',
      categoria: 'IMPIANTI',
      descrizione: 'Gestione amministrativa servizio di portierato/custodia e adempimenti datore di lavoro',
      quantita: 1,
      importoUnitario: t.maggPortineriaCustode,
      totaleVoce: t.maggPortineriaCustode,
      riferimentoNormativo: 'CCNL Proprietari Fabbricati',
    });
  }

  if (input.supercondominio) {
    vociAnalitiche.push({
      codice: 'MAGG_SUPERCONDOMINIO',
      categoria: 'IMPIANTI',
      descrizione: 'Coordinamento contabile e rapporti con il Supercondominio',
      quantita: 1,
      importoUnitario: t.maggSupercondominio,
      totaleVoce: t.maggSupercondominio,
      riferimentoNormativo: 'Art. 1117-bis e 67 disp. att. c.c.',
    });
  }

  // 3. ADEMPIMENTI FISCALI E TRIBUTARI CONDOMINIALI
  vociAnalitiche.push(
    {
      codice: 'FISC_MOD_770',
      categoria: 'FISCALE',
      descrizione: 'Elaborazione e gestione Dichiarazione Sostituto d’Imposta (Modello 770)',
      quantita: 1,
      importoUnitario: t.fiscMod770,
      totaleVoce: t.fiscMod770,
      riferimentoNormativo: 'D.P.R. 322/1998',
    },
    {
      codice: 'FISC_CERTIFICAZIONE_UNICA',
      categoria: 'FISCALE',
      descrizione: 'Predisposizione e trasmissione telematica Certificazioni Uniche (CU) percipienti',
      quantita: 1,
      importoUnitario: t.fiscCertificazioneUnica,
      totaleVoce: t.fiscCertificazioneUnica,
      riferimentoNormativo: 'D.P.R. 322/1998',
    },
    {
      codice: 'FISC_QUADRO_AC_ANAGRAFE',
      categoria: 'FISCALE',
      descrizione: 'Aggiornamento Registro Anagrafe Condominiale e dati Quadro AC/K',
      quantita: 1,
      importoUnitario: t.fiscQuadroAcAnagrafe,
      totaleVoce: t.fiscQuadroAcAnagrafe,
      riferimentoNormativo: 'Art. 1130 n. 6 c.c.',
    }
  );

  // 4. RIMBORSO SPESE VIVE E SUBENTRO EVENTUALE
  vociAnalitiche.push({
    codice: 'SPESE_CANCELLERIA_PORTALE',
    categoria: 'SPESE_VIVE',
    descrizione: 'Forfait annuo cancelleria, archiviazione digitale documentale e accesso portale condomini',
    quantita: ui,
    importoUnitario: t.speseCancelleriaSoftwarePerUi,
    totaleVoce: ui * t.speseCancelleriaSoftwarePerUi,
    riferimentoNormativo: 'Art. 1129 c. 14 c.c.',
  });

  if (input.includiPassaggioConsegne) {
    vociAnalitiche.push({
      codice: 'EXTRA_PASSAGGIO_CONSEGNE',
      categoria: 'SPESE_VIVE',
      descrizione: 'Una tantum subentro, verifica saldi iniziali e presa in carico documentale ex Art. 1129 c. 8 c.c.',
      quantita: 1,
      importoUnitario: t.extraPassaggioConsegne,
      totaleVoce: t.extraPassaggioConsegne,
      riferimentoNormativo: 'Art. 1129 c. 8 c.c.',
    });
  }

  // TOTALI PER CATEGORIA
  const sumByCategory = (cat: CondoQuoteLineItem['categoria']) =>
    vociAnalitiche.filter((v) => v.categoria === cat).reduce((acc, item) => acc + item.totaleVoce, 0);

  const compensoBaseAnnuo = sumByCategory('COMPENSO_BASE');
  const maggiorazioneImpianti = sumByCategory('IMPIANTI');
  const compensoAdempimentiFiscali = sumByCategory('FISCALE');
  const rimborsoSpeseForfettario = sumByCategory('SPESE_VIVE');

  const totaleImponibileStudio =
    compensoBaseAnnuo + maggiorazioneImpianti + compensoAdempimentiFiscali + rimborsoSpeseForfettario;

  const importoCassaPrevidenziale = Number(
    ((totaleImponibileStudio * (input.cassaPrevidenzialePct || 0)) / 100).toFixed(2)
  );
  const baseIva = totaleImponibileStudio + importoCassaPrevidenziale;
  const aliquotaEffettivaIva = input.regimeFiscale === 'FORFETTARIO_ESENTE' ? 0 : input.aliquotaIvaPct;
  const importoIva = Number(((baseIva * aliquotaEffettivaIva) / 100).toFixed(2));
  const totaleLordoAnnuoStudio = Number((baseIva + importoIva).toFixed(2));
  const costoMensileStudioPerUnita = Number((totaleLordoAnnuoStudio / ui / 12).toFixed(2));

  // STIMA BUDGET ORDINARIO COMPLESSIVO DEL CONDOMINIO (Benchmark Bergamo)
  const puliziaPartiComuni = ui * t.benchPuliziaPerUi;
  const luceAcquaPartiComuni = ui * t.benchLuceAcquaPerUi;
  const assicurazioneFabbricato = ui * t.benchAssicurazionePerUi;
  const manutenzioneAscensori = ascensori * t.benchAscensoreAnnuo;
  const riscaldamentoCentralizzato = input.riscaldamentoCentralizzato ? ui * t.benchRiscaldamentoCentrPerUi : 0;
  const manutenzioneOrdinariaEVerde =
    ui * t.benchManutenzioneBasePerUi + (input.areaVerdeCondominiale ? t.benchManutenzioneVerdeFisso : 0);

  const totaleBudgetOrdinarioAnnuo = Number(
    (
      puliziaPartiComuni +
      luceAcquaPartiComuni +
      assicurazioneFabbricato +
      manutenzioneAscensori +
      riscaldamentoCentralizzato +
      manutenzioneOrdinariaEVerde +
      totaleLordoAnnuoStudio
    ).toFixed(2)
  );
  const rataMediaMensilePerUnita = Number((totaleBudgetOrdinarioAnnuo / ui / 12).toFixed(2));

  const numeroPreventivo = `PREV-BG-${new Date().getFullYear()}-${String(ui * 17 + pert + ascensori).padStart(4, '0')}`;

  const testoPropostaMandatoArt1129 = [
    `PROPOSTA DI MANDATO E PREVENTIVO ANALITICO COMPENSO AMMINISTRATORE`,
    `(Ai sensi dell'Art. 1129, comma 14, Codice Civile e della Legge n. 4/2013)`,
    `--------------------------------------------------------------------------------`,
    `Studio Proponente: ${studioName} (Associato ANACI Bergamo #${codiceAssociato})`,
    `Stabile: ${input.condominioNome || 'Condominio da denominare'} - ${input.indirizzoCondominio || 'Bergamo (BG)'}`,
    `Consistenza: ${ui} unità principali | ${pert} pertinenze/box | ${scale} scala/e | ${ascensori} ascensore/i`,
    ``,
    `1. RIEPILOGO ANALITICO COMPENSO ANNUO (Art. 1129 c. 14 c.c.):`,
    `   • Emolumento base gestione ordinaria: € ${compensoBaseAnnuo.toFixed(2)}`,
    `   • Maggiorazioni complessità impianti e servizi: € ${maggiorazioneImpianti.toFixed(2)}`,
    `   • Adempimenti fiscali obbligatori (Mod. 770, CU, Anagrafe/AC): € ${compensoAdempimentiFiscali.toFixed(2)}`,
    `   • Forfait spese cancelleria, portale web e subentro: € ${rimborsoSpeseForfettario.toFixed(2)}`,
    `   ----------------------------------------------------------------------------`,
    `   TOTALE IMPONIBILE ANNUO STUDIO: € ${totaleImponibileStudio.toFixed(2)}`,
    `   Contributo Cassa / Rivalsa (${input.cassaPrevidenzialePct}%): € ${importoCassaPrevidenziale.toFixed(2)}`,
    input.regimeFiscale === 'FORFETTARIO_ESENTE'
      ? `   IVA: Operazione in franchigia da IVA (Regime Forfettario L. 190/2014)`
      : `   IVA (${aliquotaEffettivaIva}%): € ${importoIva.toFixed(2)}`,
    `   TOTALE COMPLESSIVO LORDO ANNUO: € ${totaleLordoAnnuoStudio.toFixed(2)} (pari a circa € ${costoMensileStudioPerUnita.toFixed(2)}/mese per u.i.)`,
    ``,
    `2. PRESTAZIONI EVENTUALI E ACCESSORIE (solo se effettivamente svolte):`,
    `   • Assemblea Straordinaria (oltre l'ordinaria annuale): € ${t.extraAssembleaStraordinaria.toFixed(2)} oltre oneri`,
    `   • Gestione amministrativa lavori straordinari (Art. 1135 c.c.): ${t.extraLavoriStraordinariPct}% sull'importo deliberato`,
    `   • Sollecito formale / messa in mora condomino moroso (addebito personale): € ${t.extraSollecitoMorosita.toFixed(2)}`,
    ``,
    `Il Professionista dichiara di essere in regola con gli obblighi di formazione periodica di cui al D.M. 140/2014 e di essere titolare di polizza RC Professionale.`
  ].join('\n');

  return {
    numeroPreventivo,
    vociAnalitiche,
    compensoBaseAnnuo,
    maggiorazioneImpianti,
    compensoAdempimentiFiscali,
    rimborsoSpeseForfettario,
    totaleImponibileStudio,
    importoCassaPrevidenziale,
    importoIva,
    totaleLordoAnnuoStudio,
    costoMensileStudioPerUnita,
    stimaBudgetCondominio: {
      puliziaPartiComuni,
      luceAcquaPartiComuni,
      assicurazioneFabbricato,
      manutenzioneAscensori,
      riscaldamentoCentralizzato,
      manutenzioneOrdinariaEVerde,
      compensoAmministratoreLordo: totaleLordoAnnuoStudio,
      totaleBudgetOrdinarioAnnuo,
      rataMediaMensilePerUnita,
    },
    tariffeAccessorieExtra: {
      assembleaStraordinaria: t.extraAssembleaStraordinaria,
      percentualeLavoriStraordinari: t.extraLavoriStraordinariPct,
      sollecitoMorosita: t.extraSollecitoMorosita,
    },
    testoPropostaMandatoArt1129,
  };
}
