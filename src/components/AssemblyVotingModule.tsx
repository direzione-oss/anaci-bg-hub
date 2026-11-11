import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Vote,
  Users,
  ShieldCheck,
  Camera,
  Monitor,
  MapPin,
  Lock,
  Unlock,
  Award,
  FileCheck2,
  UserPlus,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Maximize2,
} from 'lucide-react';
import {
  UserProfile,
  QrAccreditationMode,
  AssemblyPollItem,
  MemberAssemblyInfo,
  DelegatingMemberItem,
} from '../types';
import {
  CURRENT_MEMBER_ASSEMBLY,
  AVAILABLE_DELEGATING_MEMBERS,
  INITIAL_ASSEMBLY_POLLS,
} from '../data/mockData';

interface AssemblyVotingModuleProps {
  currentUser: UserProfile;
  onAccreditationCfpBonus?: (cfpEarned: number) => void;
}

export default function AssemblyVotingModule({
  currentUser,
  onAccreditationCfpBonus,
}: AssemblyVotingModuleProps) {
  const [assembly, setAssembly] = useState<MemberAssemblyInfo>(CURRENT_MEMBER_ASSEMBLY);
  const [polls, setPolls] = useState<AssemblyPollItem[]>(INITIAL_ASSEMBLY_POLLS);

  // Stato Accreditamento QR Code
  const [qrMode, setQrMode] = useState<QrAccreditationMode>('QR_INGRESSO_CONVEGNO');
  const [isScanningQr, setIsScanningQr] = useState(false);
  const [isAccredited, setIsAccredited] = useState(false);
  const [accreditationTime, setAccreditationTime] = useState<string | null>(null);
  const [accreditationBadgeCode, setAccreditationBadgeCode] = useState<string>('');
  const [manualTokenInput, setManualTokenInput] = useState<string>(
    CURRENT_MEMBER_ASSEMBLY.qrTokenIngresso
  );
  const [selectedDelegations, setSelectedDelegations] = useState<string[]>([]);
  const [showPosterModal, setShowPosterModal] = useState(false);

  // Selezioni temporanee per ciascuna scheda di voto
  const [pendingSelections, setPendingSelections] = useState<Record<string, string[]>>({});
  const [copiedReceiptPollId, setCopiedReceiptPollId] = useState<string | null>(null);

  const activeQrToken =
    qrMode === 'QR_INGRESSO_CONVEGNO' ? assembly.qrTokenIngresso : assembly.qrTokenOnline;

  // Peso totale del voto: 1 (voto proprio) + numero di deleghe selezionate (max 2)
  const totalVotingWeight = 1 + selectedDelegations.length;

  // Calcolo Quorum in tempo reale
  const totalPresentAndDelegated =
    assembly.presentiInSalaQr + assembly.presentiOnlineQr + assembly.delegheValidateTotali;
  const quorumReached = totalPresentAndDelegated >= assembly.quorumCostitutivoRichiesto;
  const quorumPercentage = Math.min(
    100,
    Math.round((totalPresentAndDelegated / assembly.aventiDirittoTotali) * 100)
  );

  function handleSwitchQrMode(mode: QrAccreditationMode) {
    setQrMode(mode);
    setManualTokenInput(
      mode === 'QR_INGRESSO_CONVEGNO' ? assembly.qrTokenIngresso : assembly.qrTokenOnline
    );
  }

  function handleToggleDelegation(codiceSocio: string) {
    if (isAccredited) return; // Le deleghe si registrano in fase di accreditamento
    setSelectedDelegations((prev) => {
      if (prev.includes(codiceSocio)) {
        return prev.filter((c) => c !== codiceSocio);
      }
      if (prev.length >= 2) {
        return prev; // Massimo 2 deleghe come da regolamento assembleare
      }
      return [...prev, codiceSocio];
    });
  }

  function handleScanQrAndAccredit() {
    if (isAccredited) return;
    setIsScanningQr(true);
    setTimeout(() => {
      setIsScanningQr(false);
      setIsAccredited(true);
      const nowStr = new Date().toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setAccreditationTime(nowStr);
      setAccreditationBadgeCode(
        `ACC-BG26-${currentUser.codiceAssociato.replace('BG-', '')}-${
          qrMode === 'QR_INGRESSO_CONVEGNO' ? 'SALA' : 'LIVE'
        }`
      );

      setAssembly((prev) => ({
        ...prev,
        presentiInSalaQr:
          qrMode === 'QR_INGRESSO_CONVEGNO' ? prev.presentiInSalaQr + 1 : prev.presentiInSalaQr,
        presentiOnlineQr:
          qrMode === 'QR_PUBBLICATO_ONLINE' ? prev.presentiOnlineQr + 1 : prev.presentiOnlineQr,
        delegheValidateTotali: prev.delegheValidateTotali + selectedDelegations.length,
      }));

      if (onAccreditationCfpBonus) {
        onAccreditationCfpBonus(assembly.cfpRiconosciuti);
      }
    }, 650);
  }

  function handleSelectOption(poll: AssemblyPollItem, optionId: string) {
    if (poll.userVoteHash) return; // Già votato
    setPendingSelections((prev) => {
      const current = prev[poll.id] || [];
      if (poll.maxPreferenze === 1) {
        return { ...prev, [poll.id]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [poll.id]: current.filter((id) => id !== optionId) };
      }
      if (current.length >= poll.maxPreferenze) {
        return prev;
      }
      return { ...prev, [poll.id]: [...current, optionId] };
    });
  }

  function handleCastVote(pollId: string) {
    if (!isAccredited) return;
    const selectedIds = pendingSelections[pollId] || [];
    if (selectedIds.length === 0) return;

    const nowStr = new Date().toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    )
      .join('')
      .toUpperCase();
    const voteHash = `SHA256-ANACIBG-${pollId.toUpperCase()}-${randomHex}`;

    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        return {
          ...poll,
          userSelectedIds: selectedIds,
          userVoteHash: voteHash,
          userVoteTimestamp: nowStr,
          userVoteWeight: totalVotingWeight,
          opzioni: poll.opzioni.map((opt) =>
            selectedIds.includes(opt.id)
              ? { ...opt, votiCount: opt.votiCount + totalVotingWeight }
              : opt
          ),
        };
      })
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER ISTITUZIONALE ASSEMBLEA SOCI & QUORUM IN TEMPO REALE */}
      <div
        className="rounded-[12px] text-white p-6 sm:p-8 shadow-anaci-card border border-[#009B62]/30"
        style={{
          backgroundImage: 'linear-gradient(90deg, #008051 0%, #001A10 100%)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-white/15 text-xs font-semibold text-[#EFF7F3] border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
                {assembly.dataOra}
              </span>
              <span className="px-2.5 py-1 rounded-[6px] bg-[#C23030] text-white text-xs font-semibold">
                +{assembly.cfpRiconosciuti} CFP (D.M. 140/2014) all’accreditamento QR
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
              {assembly.titolo}
            </h2>
            <p className="text-xs sm:text-sm text-[#EFF7F3]/90 leading-relaxed">
              {assembly.sottotitolo}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-[#EFF7F3]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#4ADE80]" />
                <strong>In Presenza:</strong> {assembly.luogoFisico}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-[#4ADE80]" />
                <strong>Online:</strong> {assembly.piattaformaOnline}
              </span>
            </div>
          </div>

          {/* Box Quorum Assembleare Live */}
          <div className="lg:col-span-4 bg-white text-[#333333] rounded-[10px] p-5 shadow-anaci-card border-t-4 border-[#C23030] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#008051] flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Quorum Assemblea Soci
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  quorumReached
                    ? 'bg-[#EFF7F3] text-[#008051] border border-[#009B62]/30'
                    : 'bg-[#FDF2F2] text-[#C23030]'
                }`}
              >
                {quorumReached ? 'COSTITUITA VALIDAMENTE' : 'IN ACCREDITAMENTO'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-[#EFF7F3] p-2.5 rounded-[8px] border border-[#009B62]/20">
              <div>
                <div className="text-lg font-bold text-[#008051] tabular-nums">
                  {assembly.presentiInSalaQr}
                </div>
                <div className="text-[10px] text-[#444444]">QR Sala Convegno</div>
              </div>
              <div className="border-x border-[#009B62]/20">
                <div className="text-lg font-bold text-[#008051] tabular-nums">
                  {assembly.presentiOnlineQr}
                </div>
                <div className="text-[10px] text-[#444444]">QR Diretta Online</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[#C23030] tabular-nums">
                  {assembly.delegheValidateTotali}
                </div>
                <div className="text-[10px] text-[#444444]">Deleghe Soci</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#444444]">Totale Voti Accreditati:</span>
                <strong className="text-[#333333] tabular-nums">
                  {totalPresentAndDelegated} / {assembly.aventiDirittoTotali} Soci ({quorumPercentage}%)
                </strong>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-[#008051] transition-all duration-500"
                  style={{ width: `${quorumPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-[#444444]">
                Quorum richiesto: <strong>{assembly.quorumCostitutivoRichiesto}</strong> soci (Art. 7 Statuto)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          PARTE 1: ACCREDITAMENTO TRAMITE QR CODE (INGRESSO CONVEGNO O ONLINE)
         ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonna Sinistra: Scanner / Selettore QR Ingresso o Online + Deleghe */}
        <div className="lg:col-span-7 card-anaci p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-[#EFF7F3] text-[#008051] flex items-center justify-center border border-[#009B62]/30">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#333333]">
                  1. Accreditamento Socio tramite QR Code
                </h3>
                <p className="text-xs text-[#444444]">
                  Inquadra il QR Code posto all’ingresso del convegno oppure pubblicato sullo schermo della diretta online
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPosterModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold bg-[#EFF7F3] text-[#008051] hover:bg-[#008051] hover:text-white border border-[#009B62]/30 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Mostra Totem QR Sala / Online</span>
            </button>
          </div>

          {/* Scelta Modalità QR: All'ingresso del Convegno vs Pubblicato Online */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isAccredited}
              onClick={() => handleSwitchQrMode('QR_INGRESSO_CONVEGNO')}
              className={`p-4 rounded-[10px] border-2 text-left transition-all flex items-start gap-3 ${
                qrMode === 'QR_INGRESSO_CONVEGNO'
                  ? 'border-[#008051] bg-[#EFF7F3]/70 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-[#009B62]/40'
              } ${isAccredited ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 ${
                  qrMode === 'QR_INGRESSO_CONVEGNO'
                    ? 'bg-[#008051] text-white'
                    : 'bg-gray-100 text-[#444444]'
                }`}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[#008051]">
                  In Presenza al Convegno
                </div>
                <div className="text-sm font-semibold text-[#333333] mt-0.5">
                  QR Code Varco d’Ingresso
                </div>
                <p className="text-[11px] text-[#444444] mt-1">
                  Scansiona il QR esposto sul totem di benvenuto all’ingresso della sala assembleare.
                </p>
              </div>
            </button>

            <button
              type="button"
              disabled={isAccredited}
              onClick={() => handleSwitchQrMode('QR_PUBBLICATO_ONLINE')}
              className={`p-4 rounded-[10px] border-2 text-left transition-all flex items-start gap-3 ${
                qrMode === 'QR_PUBBLICATO_ONLINE'
                  ? 'border-[#008051] bg-[#EFF7F3]/70 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-[#009B62]/40'
              } ${isAccredited ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0 ${
                  qrMode === 'QR_PUBBLICATO_ONLINE'
                    ? 'bg-[#008051] text-white'
                    : 'bg-gray-100 text-[#444444]'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[#008051]">
                  Partecipazione a Distanza
                </div>
                <div className="text-sm font-semibold text-[#333333] mt-0.5">
                  QR Code Pubblicato Online
                </div>
                <p className="text-[11px] text-[#444444] mt-1">
                  Scansiona o clicca il QR pubblicato in regia streaming o nell’area riservata online.
                </p>
              </div>
            </button>
          </div>

          {/* Gestione Deleghe tra Soci (Opzionale prima dell'accreditamento) */}
          <div className="p-4 rounded-[10px] bg-[#F6F6F6] border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#008051]" />
                <span className="text-xs font-semibold text-[#333333]">
                  Porti Deleghe di altri Soci ANACI Bergamo? (Max 2 deleghe)
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EFF7F3] text-[#008051]">
                Peso tuo voto: {totalVotingWeight} {totalVotingWeight === 1 ? 'voto' : 'voti'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_DELEGATING_MEMBERS.map((member) => {
                const isSelected = selectedDelegations.includes(member.codiceAssociato);
                return (
                  <button
                    key={member.codiceAssociato}
                    type="button"
                    disabled={isAccredited}
                    onClick={() => handleToggleDelegation(member.codiceAssociato)}
                    className={`p-2.5 rounded-[8px] border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#EFF7F3] border-[#008051] text-[#006741] font-semibold'
                        : 'bg-white border-gray-200 text-[#444444] hover:border-[#009B62]/40'
                    } ${isAccredited ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <div>
                      <div className="font-semibold text-[#333333]">
                        {member.fullName}{' '}
                        <span className="font-mono text-[10px] text-[#008051]">
                          (#{member.codiceAssociato})
                        </span>
                      </div>
                      <div className="text-[10px] text-[#444444]">{member.studioName}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isSelected
                          ? 'bg-[#008051] text-white'
                          : 'border border-gray-300 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Azione di Scansione QR / Accreditamento */}
          {!isAccredited ? (
            <div className="p-4 rounded-[10px] bg-[#EFF7F3] border border-[#009B62]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-[#006741] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#008051]" />
                  Token QR Rilevato:{' '}
                  <code className="px-1.5 py-0.5 rounded bg-white text-[#008051] font-mono border border-[#009B62]/30">
                    {manualTokenInput}
                  </code>
                </div>
                <p className="text-[#444444]">
                  Associato: <strong>{currentUser.fullName}</strong> (#{currentUser.codiceAssociato}) • Verifica quota 2026 e D.M. 140/2014 pronta.
                </p>
              </div>

              <button
                type="button"
                onClick={handleScanQrAndAccredit}
                disabled={isScanningQr}
                className="btn-anaci-primary w-full sm:w-auto whitespace-nowrap"
              >
                {isScanningQr ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifica QR in corso...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>
                      {qrMode === 'QR_INGRESSO_CONVEGNO'
                        ? 'Scansiona QR Ingresso & Accreditati'
                        : 'Accreditati con QR Online'}
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-[10px] bg-[#008051] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-[#EFF7F3] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm">
                      SOCIO ACCREDITATO CON SUCCESSO AL VOTO
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/20 font-mono text-[11px]">
                      {accreditationBadgeCode}
                    </span>
                  </div>
                  <p className="text-[#EFF7F3]/90">
                    Check-in QR registrato alle <strong>{accreditationTime}</strong> (
                    {qrMode === 'QR_INGRESSO_CONVEGNO'
                      ? 'Varco Ingresso Convegno'
                      : 'Diretta Streaming Online'}
                    ) • Abilitato con <strong>{totalVotingWeight}</strong>{' '}
                    {totalVotingWeight === 1 ? 'voto' : 'voti'} (+{assembly.cfpRiconosciuti} CFP registrati).
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-[6px] bg-white text-[#008051] font-bold text-xs whitespace-nowrap flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" />
                Urna Sbloccata
              </span>
            </div>
          )}
        </div>

        {/* Colonna Destra: Anteprima Live del QR Code d'Ingresso / Pubblicato Online */}
        <div className="lg:col-span-5 card-anaci p-6 flex flex-col items-center text-center space-y-4 border-t-4 border-[#008051]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF7F3] text-[#008051] text-xs font-semibold border border-[#009B62]/30">
            <QrCode className="w-3.5 h-3.5" />
            <span>
              {qrMode === 'QR_INGRESSO_CONVEGNO'
                ? 'QR Code Esposto all’Ingresso del Convegno'
                : 'QR Code Pubblicato Online in Diretta'}
            </span>
          </div>

          <h4 className="text-base font-semibold text-[#333333]">
            {qrMode === 'QR_INGRESSO_CONVEGNO'
              ? 'Totem Accreditamento Sala Congressi BG'
              : 'QR Code Sovraimpressione Streaming Live'}
          </h4>

          {/* Generazione Grafica SVG QR Code Ufficiale ANACI BG */}
          <div
            onClick={handleScanQrAndAccredit}
            title="Clicca sul QR Code per simulare la scansione immediata con lo smartphone"
            className="relative p-4 bg-white rounded-[12px] border-2 border-[#008051] shadow-md cursor-pointer group hover:scale-[1.02] transition-transform"
          >
            <svg
              viewBox="0 0 210 210"
              className="w-44 h-44 sm:w-48 sm:h-48 mx-auto"
              aria-label="QR Code Accreditamento Assemblea Soci ANACI Bergamo"
            >
              <rect width="210" height="210" fill="#FFFFFF" rx="8" />
              {/* Finder Pattern Alto Sinistra */}
              <rect x="14" y="14" width="52" height="52" fill="none" stroke="#008051" strokeWidth="8" rx="4" />
              <rect x="28" y="28" width="24" height="24" fill="#008051" rx="2" />
              {/* Finder Pattern Alto Destra */}
              <rect x="144" y="14" width="52" height="52" fill="none" stroke="#008051" strokeWidth="8" rx="4" />
              <rect x="158" y="28" width="24" height="24" fill="#008051" rx="2" />
              {/* Finder Pattern Basso Sinistra */}
              <rect x="14" y="144" width="52" height="52" fill="none" stroke="#008051" strokeWidth="8" rx="4" />
              <rect x="28" y="158" width="24" height="24" fill="#008051" rx="2" />

              {/* Matrice dati QR dinamica in base alla modalità */}
              <g fill="#222529">
                <rect x="78" y="14" width="10" height="10" />
                <rect x="98" y="14" width="10" height="10" />
                <rect x="118" y="14" width="10" height="10" />
                <rect x="78" y="34" width="10" height="20" />
                <rect x="108" y="34" width="20" height="10" />
                <rect x="88" y="54" width="20" height="10" />
                <rect x="14" y="78" width="20" height="10" />
                <rect x="44" y="78" width="10" height="20" />
                <rect x="14" y="98" width="10" height="20" />
                <rect x="34" y="118" width="20" height="10" />
                <rect x="144" y="78" width="10" height="20" />
                <rect x="164" y="78" width="20" height="10" />
                <rect x="184" y="98" width="12" height="20" />
                <rect x="154" y="118" width="20" height="10" />
                <rect x="78" y="144" width="20" height="10" />
                <rect x="108" y="154" width="10" height="20" />
                <rect x="78" y="174" width="10" height="22" />
                <rect x="98" y="186" width="24" height="10" />
                <rect x="144" y="144" width="20" height="20" />
                <rect x="174" y="154" width="22" height="10" />
                <rect x="154" y="174" width="12" height="22" />
                <rect x="180" y="180" width="16" height="16" fill="#C23030" />
                {qrMode === 'QR_INGRESSO_CONVEGNO' ? (
                  <>
                    <rect x="64" y="64" width="12" height="12" />
                    <rect x="134" y="64" width="12" height="12" />
                    <rect x="64" y="134" width="12" height="12" />
                  </>
                ) : (
                  <>
                    <rect x="64" y="84" width="12" height="12" fill="#008051" />
                    <rect x="134" y="84" width="12" height="12" fill="#008051" />
                    <rect x="84" y="134" width="12" height="12" fill="#008051" />
                  </>
                )}
              </g>

              {/* Badge Centrale ANACI BG */}
              <rect
                x="72"
                y="76"
                width="66"
                height="58"
                rx="8"
                fill="#008051"
                stroke="#FFFFFF"
                strokeWidth="4"
              />
              <text
                x="105"
                y="102"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="13"
                fontWeight="bold"
                fontFamily="Poppins, sans-serif"
              >
                ANACI
              </text>
              <rect x="85" y="108" width="40" height="3" fill="#C23030" rx="1.5" />
              <text
                x="105"
                y="124"
                textAnchor="middle"
                fill="#EFF7F3"
                fontSize="9"
                fontWeight="600"
                fontFamily="Poppins, sans-serif"
              >
                {qrMode === 'QR_INGRESSO_CONVEGNO' ? 'INGRESSO' : 'ONLINE'}
              </text>
            </svg>

            {!isAccredited && (
              <div className="mt-2 text-[11px] font-semibold text-[#C23030] group-hover:underline">
                Clicca sul QR per simulare la scansione immediata →
              </div>
            )}
          </div>

          <div className="w-full p-3 rounded-[8px] bg-[#EFF7F3] border border-[#009B62]/25 text-xs space-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[#444444]">Codice Univoco QR:</span>
              <span className="font-mono font-bold text-[#008051]">{activeQrToken}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#444444]">Verifica Automatica:</span>
              <span className="font-semibold text-[#333333]">Quota 2026 + D.M. 140/2014</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          PARTE 2: VOTAZIONI ELETTRONICHE IN TEMPO REALE (ORDINE DEL GIORNO)
         ===================================================================== */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#008051]">
              Urna Digitale Certificata ANACI Bergamo
            </span>
            <h3 className="text-xl font-semibold text-[#333333]">
              2. Votazioni all’Ordine del Giorno dell’Assemblea Soci
            </h3>
          </div>

          {!isAccredited ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-[#FDF2F2] border border-[#C23030]/30 text-xs text-[#C23030] font-semibold">
              <Lock className="w-4 h-4" />
              <span>Accreditati sopra tramite il QR Code per sbloccare l’espressione del voto</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[8px] bg-[#EFF7F3] border border-[#009B62]/30 text-xs text-[#006741] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#008051]" />
              <span>
                Diritto di voto attivo per <strong>{currentUser.fullName}</strong> (Peso voto:{' '}
                {totalVotingWeight})
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {polls.map((poll) => {
            const totalPollVotes = poll.opzioni.reduce((acc, o) => acc + o.votiCount, 0);
            const currentSelected = pendingSelections[poll.id] || [];
            const hasVoted = !!poll.userVoteHash;

            return (
              <div key={poll.id} className="card-anaci p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-[5px] bg-[#008051] text-white text-xs font-bold">
                        Punto {poll.numeroPuntoOdg} O.d.G.
                      </span>
                      <span className="px-2.5 py-0.5 rounded-[5px] bg-[#EFF7F3] text-[#006741] text-xs font-semibold border border-[#009B62]/30">
                        {poll.riferimentoStatuto}
                      </span>
                      <span className="text-xs font-medium text-[#444444]">
                        • Max preferenze: <strong>{poll.maxPreferenze}</strong>
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-[#333333] pt-1">{poll.titolo}</h4>
                    <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                      {poll.descrizione}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        hasVoted
                          ? 'bg-[#EFF7F3] text-[#008051] border border-[#009B62]/30'
                          : 'bg-[#FDF2F2] text-[#C23030]'
                      }`}
                    >
                      <Vote className="w-3.5 h-3.5" />
                      {hasVoted ? 'VOTO REGISTRATO' : 'VOTAZIONE APERTA'}
                    </span>
                    <div className="text-[11px] text-[#444444] mt-1 tabular-nums">
                      Voti scrutinati: <strong>{totalPollVotes}</strong>
                    </div>
                  </div>
                </div>

                {/* Opzioni di Voto / Candidati */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {poll.opzioni.map((opt) => {
                    const pct =
                      totalPollVotes > 0 ? Math.round((opt.votiCount / totalPollVotes) * 100) : 0;
                    const isChecked = hasVoted
                      ? poll.userSelectedIds?.includes(opt.id)
                      : currentSelected.includes(opt.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() => !hasVoted && handleSelectOption(poll, opt.id)}
                        className={`p-4 rounded-[10px] border-2 transition-all cursor-pointer space-y-2.5 ${
                          isChecked
                            ? 'border-[#008051] bg-[#EFF7F3]/70 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-[#009B62]/40'
                        } ${hasVoted ? 'cursor-default' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center text-xs font-bold shrink-0 ${
                                isChecked
                                  ? 'bg-[#008051] text-white'
                                  : 'border-2 border-gray-300 bg-white'
                              }`}
                            >
                              {isChecked ? '✓' : ''}
                            </div>
                            <div>
                              {opt.badge && (
                                <span className="inline-block text-[10px] font-bold uppercase text-[#008051] mb-0.5">
                                  {opt.badge}
                                </span>
                              )}
                              <div className="text-sm font-semibold text-[#333333]">
                                {opt.label}
                              </div>
                              {opt.subLabel && (
                                <p className="text-xs text-[#444444] mt-0.5">{opt.subLabel}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-[#008051] tabular-nums">
                              {pct}%
                            </span>
                            <div className="text-[11px] text-[#444444] tabular-nums">
                              {opt.votiCount} voti
                            </div>
                          </div>
                        </div>

                        {/* Barra progresso scrutinio */}
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              opt.colorClass || 'bg-[#008051]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Scheda: Pulsante Conferma Voto o Ricevuta Crittografata */}
                {hasVoted ? (
                  <div className="p-3.5 rounded-[8px] bg-[#EFF7F3] border border-[#009B62]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#006741]">
                      <FileCheck2 className="w-4 h-4 text-[#008051] shrink-0" />
                      <span>
                        Voto certificato alle <strong>{poll.userVoteTimestamp}</strong> (peso
                        applicato: <strong>{poll.userVoteWeight}</strong>) • Ricevuta:{' '}
                        <code className="font-mono font-bold text-[#008051]">
                          {poll.userVoteHash}
                        </code>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (poll.userVoteHash) {
                          navigator.clipboard.writeText(poll.userVoteHash);
                          setCopiedReceiptPollId(poll.id);
                          setTimeout(() => setCopiedReceiptPollId(null), 2000);
                        }
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-[#008051] hover:underline"
                    >
                      {copiedReceiptPollId === poll.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ricevuta Copiata</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copia Hash Ricevuta</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-[#444444]">
                      {currentSelected.length === 0
                        ? `Seleziona fino a ${poll.maxPreferenze} opzione/i per esprimere il voto.`
                        : `Hai selezionato ${currentSelected.length} su ${poll.maxPreferenze} preferenze disponibili.`}
                    </span>

                    {!isAccredited ? (
                      <button
                        type="button"
                        onClick={handleScanQrAndAccredit}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#C23030] hover:bg-[#A3242B] text-white text-xs font-semibold transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Accreditati prima col QR Code per Votare</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={currentSelected.length === 0}
                        onClick={() => handleCastVote(poll.id)}
                        className={`btn-anaci-primary text-xs ${
                          currentSelected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Vote className="w-4 h-4" />
                        <span>
                          Conferma Voto Definitivo ({totalVotingWeight}{' '}
                          {totalVotingWeight === 1 ? 'voto' : 'voti'})
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALE POSTER / TOTEM QR CODE INGRESSO CONVEGNO & SOVRAIMPRESSIONE ONLINE */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[12px] shadow-anaci-popup max-w-lg w-full p-6 text-center space-y-4 border-t-4 border-[#008051]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold uppercase text-[#008051]">
                Cartello Ufficiale Accreditamento ANACI Bergamo
              </span>
              <button
                onClick={() => setShowPosterModal(false)}
                className="text-xs font-semibold text-[#444444] hover:text-[#C23030]"
              >
                Chiudi ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#333333]">{assembly.titolo}</h3>
              <p className="text-xs text-[#444444]">
                {qrMode === 'QR_INGRESSO_CONVEGNO'
                  ? 'Totem Ingresso Sala Convegno — Inquadra con l’app ANACI BG Hub per registrare la presenza e abilitare il voto'
                  : 'Regia Streaming Online — Inquadra sullo schermo per accreditarti a distanza e votare in diretta'}
              </p>
            </div>

            <div className="p-4 bg-[#EFF7F3] rounded-[10px] inline-block border border-[#009B62]/30">
              <div className="font-mono text-sm font-bold text-[#008051] mb-1">
                {activeQrToken}
              </div>
              <div className="text-[11px] text-[#444444]">
                Riconosce automaticamente +{assembly.cfpRiconosciuti} CFP (D.M. 140/2014)
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPosterModal(false);
                  handleScanQrAndAccredit();
                }}
                className="btn-anaci-primary text-xs"
              >
                <QrCode className="w-4 h-4" />
                <span>Simula Scansione di questo QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
