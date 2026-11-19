import { useEffect, useState } from 'react';
import { AlertCircle, Send, Trash2 } from 'lucide-react';
import { CHAPTERS, SUBJECTS, TOPICS } from '../../content/registry';
import { MathText } from '../../components/equations/MathText';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface TutorPageProps {
  initialTopic?: string;
}

export function TutorPage({ initialTopic }: TutorPageProps) {
  const availableSubjects = SUBJECTS.filter((s) => s.status === 'available');
  const [selectedSubject, setSelectedSubject] = useState(availableSubjects[0]?.title ?? 'Classical Mechanics');
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]?.title ?? 'Vectors');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || TOPICS[0]?.title || 'Introduction to Vectors');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [hintFirst, setHintFirst] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialTopic) {
      setSelectedTopic(initialTopic);
    }
  }, [initialTopic]);

  const starterPrompts = [
    `Explain ${selectedTopic} step by step with physical intuition.`,
    `How do the equations in ${selectedTopic} connect to real-world motion or forces?`,
    `Give me a practice problem on ${selectedTopic} and wait for my attempt.`,
    `Why is $\\hat{i} \\times \\hat{j} = \\hat{k}$ while $\\hat{j} \\times \\hat{i} = -\\hat{k}$?`,
  ];

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          context: {
            subject: selectedSubject,
            chapter: selectedChapter,
            topic: selectedTopic,
            level,
            hintFirst,
          },
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setErrorMsg(data.error || 'Could not reach the AI Physics Tutor. Please try again.');
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: data.reply!,
        },
      ]);
    } catch {
      setErrorMsg('Network error while contacting the PhysicsKit server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-600">Context-Aware Pedagogical Assistant</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">AI Physics Tutor</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Ask conceptual questions, inspect derivations, request Socratic hints, or check your solutions.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setErrorMsg(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-600"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear session</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Context & Pedagogy Configuration Panel */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Learning Context</h2>

          <div className="space-y-3">
            <div>
              <label htmlFor="tutor-subject" className="block text-xs font-medium text-slate-600 mb-1">
                Subject
              </label>
              <select
                id="tutor-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                {availableSubjects.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tutor-chapter" className="block text-xs font-medium text-slate-600 mb-1">
                Chapter
              </label>
              <select
                id="tutor-chapter"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                {CHAPTERS.filter((c) => c.status === 'available').map((c) => (
                  <option key={c.id} value={c.title}>
                    Chapter {c.number}: {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tutor-topic" className="block text-xs font-medium text-slate-600 mb-1">
                Active Topic
              </label>
              <select
                id="tutor-topic"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.order}. {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-600 mb-1.5">Explanation Depth</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-1.5 px-2 rounded-md text-xs font-medium capitalize transition-colors ${
                      level === lvl ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hintFirst}
                onChange={(e) => setHintFirst(e.target.checked)}
                className="mt-0.5 accent-blue-600"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800 block">Hint-first guidance</strong>
                Give targeted hints and setup steps before revealing full numerical answers.
              </span>
            </label>
          </div>
        </aside>

        {/* Tutor Workspace */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl flex flex-col min-h-[520px]">
          <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              Focused on: <strong className="text-slate-900">{selectedSubject}</strong> ·{' '}
              <strong className="text-slate-900">{selectedChapter}</strong> ·{' '}
              <strong className="text-blue-700">{selectedTopic}</strong>
            </span>
            <span className="capitalize font-medium">{level} level</span>
          </div>

          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[540px]">
            {messages.length === 0 ? (
              <div className="space-y-4 py-4">
                <p className="text-sm text-slate-600">
                  Ask any question about <strong>{selectedTopic}</strong>, paste a vector problem, or pick a starting prompt below:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {starterPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(p)}
                      className="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs text-slate-700 transition-colors"
                    >
                      <MathText text={p} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white ml-8 sm:ml-16'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 mr-4 sm:mr-10'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 opacity-75">
                    {msg.role === 'user' ? 'Student' : 'PhysicsKit Tutor'}
                  </div>
                  <div className="whitespace-pre-wrap">
                    <MathText text={msg.text} />
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 mr-10">
                Working through the physics steps…
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs sm:text-sm text-red-900 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-4 border-t border-slate-200 flex items-center gap-2"
          >
            <label htmlFor="tutor-question-input" className="sr-only">
              Ask the AI Physics Tutor a question
            </label>
            <input
              id="tutor-question-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${selectedTopic}...`}
              className="flex-1 h-10 px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || input.trim().length === 0}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Ask</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
