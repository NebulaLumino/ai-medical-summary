'use client';

import { useState } from 'react';

export default function MedicalSummaryPage() {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [readability, setReadability] = useState('patient');
  const [focus, setFocus] = useState('full');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !abstract.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, abstract, readability, focus }),
      });
      const data = await res.json();
      setResult(data.result || data.error || 'An error occurred.');
    } catch {
      setResult('Failed to generate summary. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 flex flex-col">
      <header className="border-b border-cyan-500/20 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🏥</span>
          <div>
            <h1 className="text-xl font-bold text-cyan-400">Medical Literature Plain Language Summary</h1>
            <p className="text-xs text-gray-400">AI-powered health research translator</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-cyan-500/20 rounded-2xl p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-cyan-300">Article / Study Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Efficacy of mRNA vaccines against variants"
                className="bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-cyan-300">Focus Area</label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="full">Full Plain Language Summary</option>
                <option value="methods">Methods Explained</option>
                <option value="results">Results & Findings</option>
                <option value="limitations">Study Limitations</option>
                <option value="clinical">Clinical Implications</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-300">Abstract / Key Text (optional)</label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Paste the study abstract or relevant excerpt here..."
              rows={5}
              className="bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-cyan-300">Readability Level</label>
            <select
              value={readability}
              onChange={(e) => setReadability(e.target.value)}
              className="bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="patient">Patient / General Public (Grade 8)</option>
              <option value="educated">Educated Non-Specialist (Grade 12)</option>
              <option value="professional">Healthcare Professional</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Translating Research…' : '📝 Generate Plain Language Summary'}
          </button>
        </form>

        {result && (
          <div className="bg-gray-900/60 border border-cyan-500/20 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-cyan-300 mb-4 uppercase tracking-wider">Plain Language Summary</h2>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</div>
          </div>
        )}
      </main>
    </div>
  );
}
