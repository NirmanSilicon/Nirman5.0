import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from "axios";
import ReactMarkdown from "react-markdown";
const PRIMARY = '#0000FF';
const ACCENT = '#ADD8E6';

export default function NotesPage(
  {
  overview = 'A short, engaging overview that quickly explains what this topic is about and why it matters. Keep it punchy.',
}) {

  const {topicname, topicId,subId} = useParams()
  const [summary,setSummary] = useState("")
  const [formula,setFormula] = useState([])
  const [question,setQuestion] = useState([])
  const [exp,setExp] = useState([])
  const [isFocus, setIsFocus] = useState(false);

const toggleFocusMode = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    setIsFocus(true);
  } else {
    document.exitFullscreen();
    setIsFocus(false);
  }
};


  useEffect(()=>{
    const fetch = async() =>{
      try {
        const res = await axios.get(`http://localhost:3000/api/topic/${subId}/${topicId}`)
        console.log(res.data)
        setSummary(res.data.summary.text)
        setFormula(res.data.summary.key_formulas)
        setQuestion(res.data.analytical_questions)
        setExp(res.data.real_world_examples)
      } catch (error) {
        console.error(error)
      }
    };
    fetch();
  },[])
  return (
    <div className="min-h-screen p-6 bg-linear-to-b" style={{ background: `linear-gradient(180deg, ${ACCENT} 0%, #f7fbff 70%)` }}>
      <div className="max-w-6xl mx-auto mt-20">
        {/* Header / Hero */}
        <header className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
          <div
            className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
            style={{ background: `${PRIMARY}` }}
          >
            <div className="md:col-span-2 text-white">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">{topicname}</h1>
              <p className="mt-3 text-sm md:text-base opacity-90 max-w-2xl">{overview }</p>

              <div className="mt-6 flex gap-3 items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">Overview</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm">Key Formulas</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm">Analytic Qs</span>
              </div>
            </div>

            <div className="md:col-span-1 flex justify-end">
              <div className="w-40 h-40 rounded-xl bg-white/20 backdrop-blur-md p-4 flex flex-col items-center justify-center shadow-lg">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C7.03 2 3 6.03 3 11c0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.97-4.03-9-9-9z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-2 text-white text-xs text-center">Quick read</div>
              </div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column: content */}
          <section className="lg:col-span-3 space-y-6">
            {/* Overview card */}
            <article className="p-6 rounded-2xl bg-white shadow-lg border border-neutral-100">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">Topic Overview</h2>
                <div className="text-sm text-neutral-500">Conceptual</div>
              </div>
              <p className="mt-4 text-neutral-700 leading-relaxed px-3">{summary}</p>
            </article>

            {/* Key formulas */}
            <article className="p-6 rounded-2xl bg-linear-to-br from-white to-sky-50 shadow-lg border border-neutral-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Key Formulas</h2>
                <div className="text-sm text-neutral-500">Memorize these</div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {formula.map((f) => (
                  <div key={f} className="p-4 rounded-xl bg-white/80 hover:scale-[1.01] transition transform shadow-inner border">
                    
                    <div className="mt-2 text-sm bg-linear-to-r from-white to-transparent p-3 rounded text-neutral-800 overflow-auto">
                     <ReactMarkdown>
                       {f}
                     </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ background: PRIMARY }}>Copy formulas</button>
              </div>
            </article>

            {/* Analytic questions */}
            <article className="p-6 rounded-2xl bg-white shadow-lg border border-neutral-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Analytic Questions</h2>
                <div className="text-sm text-neutral-500">(Questions only — no answers)</div>
              </div>

              <ol className="mt-4 space-y-3 list-decimal list-inside text-neutral-700">
                {question.map((q, i) => (
                  <li key={i} className="p-3 rounded-lg bg-slate-50 border border-dashed border-slate-100">{q}</li>
                ))}
              </ol>

              <div className="mt-6 text-sm text-neutral-500">Tip: Try solving these on paper before looking up hints.</div>
            </article>

            {/* Real world example */}
            <article className="p-6 rounded-2xl bg-linear-to-br from-white to-slate-50 shadow-lg border border-neutral-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Real-world Example</h2>
                <div className="text-sm text-neutral-500">Applied</div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-2">
                  {exp.map((example, index) => (
        <div key={index} className="mb-4">
          <p className="mt-2 text-neutral-700 leading-relaxed"><ReactMarkdown>{example}</ReactMarkdown></p>
        </div>
      ))}
                </div>

                <div className="flex justify-center">
                  <div className="w-40 h-40 rounded-xl overflow-hidden shadow-md" style={{ background: ACCENT }}>
                    {/* illustrative placeholder */}
                    <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <rect width="200" height="200" fill="none" />
                      <circle cx="100" cy="80" r="34" fill="#ffffff90" />
                      <rect x="30" y="120" width="140" height="40" rx="8" fill="#ffffff60" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>

          </section>

          {/* Right column: mini-nav / progress */}
          <aside className="lg:col-span-1 sticky top-24 self-start">
            <div className="p-4 rounded-2xl bg-white shadow-lg border border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-700">Study Flow</h3>
              <div className="mt-4 space-y-3">
                <ProgressStep step={1} label="Overview" primary={PRIMARY} accent={PRIMARY} />
                <ProgressStep step={2} label="Formulas" primary={PRIMARY} accent={PRIMARY} />
                <ProgressStep step={3} label="Questions" primary={PRIMARY} accent={PRIMARY} />
                <ProgressStep step={4} label="Example" primary={PRIMARY} accent={PRIMARY} />
              </div>

              <div className="mt-6 text-center">
                <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ background: PRIMARY }}>Start Quick Revision</button>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-linear-to-br from-white to-sky-50 shadow-sm border border-neutral-100 text-sm">
              {/* <div className="font-medium text-amber-50 py-2 px-3 rounded-sm w-min bg-red-600">Focus</div> */}
              <button
  onClick={toggleFocusMode}
  className="px-4 py-2 mt-3 rounded-lg text-white font-medium bg-red-600 hover:bg-red-500 backdrop-blur-md"
>
  {isFocus ? "Exit Focus Mode" : "Enter Focus Mode"}
</button>

              <p className="mt-2 text-neutral-600">Tap "Start Quick Revision" to jump between cards and questions — great for 10-minute sprints.</p>
            </div>
          </aside>
        </main>

        {/* Footer small */}
        <footer className="mt-10 text-center text-sm text-neutral-500">Made with ♥ using your brand colors.</footer>
      </div>
    </div>
  );
}

function ProgressStep({ step, label, primary, accent }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ background: `linear-gradient(180deg, ${primary}, ${accent})` }}
      >
        {step}
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-neutral-500">{step === 1 ? 'Start here' : 'Continue'}</div>
      </div>
    </div>
  );
}

