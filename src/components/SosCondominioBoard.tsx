import React, { useState } from 'react';
import {
  AlertTriangle,
  ThumbsUp,
  Scale,
  EyeOff,
  Eye,
  Plus,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Filter,
  Send,
  ShieldAlert,
  X,
} from 'lucide-react';
import { SosPostItem, SosTag, UserProfile } from '../types';

interface SosCondominioBoardProps {
  posts: SosPostItem[];
  currentUser: UserProfile;
  onAddPost: (newPost: Omit<SosPostItem, 'id' | 'viewsCount' | 'createdAt' | 'replies'>) => void;
  onVoteReply: (postId: string, replyId: string) => void;
  onAddReply: (
    postId: string,
    content: string,
    isAnonymous: boolean,
    riferimentiNormativi?: string
  ) => void;
}

const SOS_TAGS: ('TUTTI' | SosTag)[] = [
  'TUTTI',
  'Morosità',
  'Infiltrazioni',
  'Parti Comuni',
  'Superbonus/Bonus Edilizi',
  'Distacchi',
];

export const SosCondominioBoard: React.FC<SosCondominioBoardProps> = ({
  posts,
  currentUser,
  onAddPost,
  onVoteReply,
  onAddReply,
}) => {
  const [selectedTag, setSelectedTag] = useState<'TUTTI' | SosTag>('TUTTI');
  const [onlyWithExpertOpinion, setOnlyWithExpertOpinion] = useState(false);
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(posts[0]?.id || null);

  // New Post Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [primaryTag, setPrimaryTag] = useState<SosTag>('Infiltrazioni');
  const [zonaCondominio, setZonaCondominio] = useState('Bergamo Città');
  const [urgency, setUrgency] = useState<'NORMALE' | 'ALTA' | 'CRITICA'>('ALTA');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [richiedeParereCS, setRichiedeParereCS] = useState(true);

  // Reply Composer state per post
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyNormaMap, setReplyNormaMap] = useState<Record<string, string>>({});
  const [replyAnonMap, setReplyAnonMap] = useState<Record<string, boolean>>({});

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === 'TUTTI' || post.primaryTag === selectedTag;
    const matchesExpert =
      !onlyWithExpertOpinion || post.replies.some((r) => r.isOfficialExpertOpinion);
    return matchesTag && matchesExpert;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddPost({
      authorName: currentUser.fullName,
      authorCode: currentUser.codiceAssociato,
      isAnonymous,
      anonymousAlias: isAnonymous
        ? `Associato Verificato #BG-Anonimo (${zonaCondominio})`
        : `${currentUser.fullName} (#${currentUser.codiceAssociato})`,
      title: title.trim(),
      content: content.trim(),
      primaryTag,
      secondaryTags: [zonaCondominio, richiedeParereCS ? 'Quesito Centro Studi' : 'Confronto Colleghi'],
      zonaCondominio,
      urgency,
      status: richiedeParereCS ? 'IN_ANALISI_CS' : 'APERTO',
      richiedeParereCentroStudi: richiedeParereCS,
    });

    setTitle('');
    setContent('');
    setNewPostModalOpen(false);
  };

  const handleReplySubmit = (postId: string) => {
    const txt = (replyTextMap[postId] || '').trim();
    if (!txt) return;
    onAddReply(
      postId,
      txt,
      Boolean(replyAnonMap[postId]),
      replyNormaMap[postId]?.trim() || undefined
    );
    setReplyTextMap((prev) => ({ ...prev, [postId]: '' }));
    setReplyNormaMap((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0A2540] text-white rounded-2xl p-6 border border-[#12385E] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8B1E24] text-white uppercase tracking-wider">
              Modulo 3.5 & 3.6 • Confronto Riservato & Centro Studi
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-emerald-300">
              ● Anonimizzazione Privacy Condominio Attiva
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Bacheca "Casi Critici & SOS Condominio" + Sportello Esperti
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl">
            Condividi problematiche complesse con i colleghi di Bergamo (anche in modalità anonima), assegna il{" "}
            <strong className="text-white">Voto Utile</strong> alle soluzioni più efficaci e richiedi il parere formale dei consulenti del{" "}
            <strong className="text-white">Centro Studi Provinciale ANACI BG</strong>.
          </p>
        </div>

        <button
          onClick={() => setNewPostModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-[#8B1E24] hover:bg-[#A3242B] text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Pubblica Caso Critico / Quesito SOS
        </button>
      </div>

      {/* Tag Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Tag:
          </span>
          {SOS_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedTag === tag
                  ? 'bg-[#0A2540] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tag === 'TUTTI' ? `Tutti i Casi (${posts.length})` : `#${tag}`}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A2540] cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <input
            type="checkbox"
            checked={onlyWithExpertOpinion}
            onChange={(e) => setOnlyWithExpertOpinion(e.target.checked)}
            className="rounded text-[#8B1E24] focus:ring-[#0A2540]"
          />
          Solo con Parere Ufficiale Centro Studi
        </label>
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isExpanded = expandedPostId === post.id;
          const hasExpertOpinion = post.replies.some((r) => r.isOfficialExpertOpinion);

          return (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition"
            >
              {/* Thread Header & Body */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0A2540] text-white text-xs font-bold">
                      #{post.primaryTag}
                    </span>

                    {post.urgency === 'CRITICA' && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Urgenza Critica
                      </span>
                    )}

                    {hasExpertOpinion && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5" /> Parere Centro Studi Emesso
                      </span>
                    )}

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8B1E24]" /> {post.zonaCondominio}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {post.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                        <EyeOff className="w-3 h-3 text-slate-500" />
                        {post.anonymousAlias}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0A2540] font-semibold">
                        <Eye className="w-3 h-3" />
                        {post.anonymousAlias}
                      </span>
                    )}
                    <span>• {post.createdAt}</span>
                  </div>
                </div>

                <h3
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="text-base sm:text-lg font-extrabold text-[#0A2540] hover:text-[#8B1E24] cursor-pointer leading-snug"
                >
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {post.content}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {post.secondaryTags.map((st, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {st}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="text-xs font-bold text-[#8B1E24] hover:underline flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {isExpanded
                      ? `Nascondi Risposte e Pareri (${post.replies.length})`
                      : `Leggi Risposte e Pareri (${post.replies.length}) →`}
                  </button>
                </div>
              </div>

              {/* Replies & Expert Opinions Drawer */}
              {isExpanded && (
                <div className="bg-[#F8FAFC] border-t border-slate-200 p-5 sm:p-6 space-y-4">
                  {post.replies.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">
                      Nessuna risposta ancora pubblicata. Sii il primo collega o Esperto del Centro Studi a intervenire!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {post.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-4 rounded-xl border ${
                            reply.isOfficialExpertOpinion
                              ? 'bg-white border-l-4 border-l-[#8B1E24] border-slate-200 shadow-xs'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-extrabold text-[#0A2540]">
                                {reply.isAnonymous
                                  ? 'Collega Associato #BG-Anonimo'
                                  : reply.authorName}
                              </span>
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                                  reply.isOfficialExpertOpinion
                                    ? 'bg-[#8B1E24] text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {reply.authorBadge}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                • {reply.createdAt}
                              </span>
                            </div>

                            {/* "Voto Utile" Button */}
                            <button
                              onClick={() => onVoteReply(post.id, reply.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                                reply.userHasVoted
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>Voto Utile</span>
                              <span className="font-mono px-1.5 py-0.2 bg-black/10 rounded">
                                +{reply.helpfulVotes}
                              </span>
                            </button>
                          </div>

                          {reply.riferimentiNormativi && (
                            <div className="mb-2 px-2.5 py-1 rounded bg-slate-100 text-[11px] font-mono font-semibold text-[#0A2540] inline-block">
                              Rif. Normativi: {reply.riferimentiNormativi}
                            </div>
                          )}

                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Box (Role-Aware: Esperto vs Associato) */}
                  <div className="pt-3 border-t border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0A2540]">
                        {currentUser.role === 'ESPERTO'
                          ? `⚖️ Stai rispondendo come Esperto Ufficiale Centro Studi (${currentUser.fullName})`
                          : `Rispondi al collega come ${currentUser.fullName} (#${currentUser.codiceAssociato})`}
                      </span>

                      {currentUser.role !== 'ESPERTO' && (
                        <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(replyAnonMap[post.id])}
                            onChange={(e) =>
                              setReplyAnonMap((prev) => ({
                                ...prev,
                                [post.id]: e.target.checked,
                              }))
                            }
                            className="rounded text-[#8B1E24]"
                          />
                          Rispondi in modalità anonima
                        </label>
                      )}
                    </div>

                    {currentUser.role === 'ESPERTO' && (
                      <input
                        type="text"
                        value={replyNormaMap[post.id] || ''}
                        onChange={(e) =>
                          setReplyNormaMap((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="Riferimenti normativi / giurisprudenziali (es. Art. 1126 c.c. | Sent. Trib. Bergamo Sez. IV)..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                      />
                    )}

                    <div className="flex gap-2">
                      <textarea
                        rows={2}
                        value={replyTextMap[post.id] || ''}
                        onChange={(e) =>
                          setReplyTextMap((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          currentUser.role === 'ESPERTO'
                            ? 'Redigi il Parere Ufficiale del Centro Studi ANACI Bergamo (verrà indicizzato anche nella Knowledge Base)...'
                            : 'Condividi come hai risolto questo caso nel tuo studio o indica un riferimento pratico...'
                        }
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                      />
                      <button
                        type="button"
                        onClick={() => handleReplySubmit(post.id)}
                        className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                          currentUser.role === 'ESPERTO'
                            ? 'bg-[#8B1E24] hover:bg-[#A3242B]'
                            : 'bg-[#0A2540] hover:bg-[#12385E]'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {currentUser.role === 'ESPERTO'
                          ? 'Emetti Parere CS'
                          : 'Pubblica Risposta'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: Nuovo Caso Critico / SOS Condominio */}
      {newPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  Bacheca SOS Condominio & Ticketing Centro Studi
                </span>
                <h3 className="text-lg font-bold">Pubblica Nuovo Caso Critico</h3>
              </div>
              <button
                onClick={() => setNewPostModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-sm">
              {/* Anonymization Toggle Highlight */}
              <div className="p-3.5 rounded-xl bg-[#FDF2F3] border border-[#8B1E24]/30 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <EyeOff className="w-5 h-5 text-[#8B1E24] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#0A2540]">
                      Modalità Anonimizzata Privacy Condominio
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Se attiva, il tuo nome e lo studio saranno oscurati e il post apparirà come{' '}
                      <strong>"Associato Verificato #BG-Anonimo"</strong>.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 rounded text-[#8B1E24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tag Principale
                  </label>
                  <select
                    value={primaryTag}
                    onChange={(e) => setPrimaryTag(e.target.value as SosTag)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="Morosità">Morosità</option>
                    <option value="Infiltrazioni">Infiltrazioni</option>
                    <option value="Parti Comuni">Parti Comuni</option>
                    <option value="Superbonus/Bonus Edilizi">Superbonus/Bonus Edilizi</option>
                    <option value="Distacchi">Distacchi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Zona (Bergamo)
                  </label>
                  <select
                    value={zonaCondominio}
                    onChange={(e) => setZonaCondominio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option>Bergamo Città</option>
                    <option>Città Alta (Bergamo)</option>
                    <option>Val Seriana</option>
                    <option>Val Brembana</option>
                    <option>Isola Bergamasca</option>
                    <option>Bassa Bergamasca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Livello Urgenza
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) =>
                      setUrgency(e.target.value as 'NORMALE' | 'ALTA' | 'CRITICA')
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="NORMALE">Normale</option>
                    <option value="ALTA">Alta Priorità</option>
                    <option value="CRITICA">Critica / Assemblea Imminente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titolo del Caso / Quesito
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Es. Riparto spese rifacimento cortile sovrastante autorimessa interrata..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrizione tecnica/giuridica della problematica
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descrivi i fatti, eventuali articoli del Regolamento di Condominio e il dubbio operativo..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#0A2540] cursor-pointer">
                <input
                  type="checkbox"
                  checked={richiedeParereCS}
                  onChange={(e) => setRichiedeParereCS(e.target.checked)}
                  className="rounded text-[#8B1E24]"
                />
                Inoltra contestualmente allo Sportello Esperti Centro Studi Provinciale ANACI BG
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#8B1E24] hover:bg-[#A3242B] text-white text-xs font-bold"
                >
                  Pubblica in Bacheca SOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
