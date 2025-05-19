import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';

const API_BASE = 'https://author-analyzer.netlify.app/.netlify/functions/analyze-author';

const App = () => {
  const fieldRef = useRef(null);
  const [authorLink, setAuthorLink] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        authorLink,
        authorName: authorName.trim(),
      });
      const res = await fetch(`${API_BASE}?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setStats(data);

      // Animate form out
      gsap.to(fieldRef.current, {
        scale: 0,
        ease: 'power3.in',
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // Animate form back in
    gsap.to(fieldRef.current, {
      scale: 1,
      ease: 'power3.out',
    });
    setStats(null);
    setError(null);
    setAuthorLink('');
    setAuthorName('');
  };

  return (
    <div className="relative w-screen h-lvh">
      {/* Header */}
      <header className="h-[12%] w-full bg-blue-950 flex items-center justify-center sm:justify-start px-10">
        <h1 className="text-5xl sm:text-6xl py-2 text-white font-serif">Author Counter</h1>
      </header>

      {/* Main content */}
      <main className="h-[88%] flex items-center justify-center bg-gray-100">
        <div
          ref={fieldRef}
          className="absolute absolute-center flex flex-col gap-8 bg-white p-13 rounded-4xl shadow-2xl h-fit max-h-[70%] w-[90%] max-w-xl z-10 scale-100 transform"
        >
          <label className="flex flex-col text-lg font-medium text-gray-700">
            Author profile link:
            <input
              type="text"
              value={authorLink}
              onChange={e => setAuthorLink(e.target.value)}
              placeholder="Enter profile link"
              className="mt-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col text-lg font-medium text-gray-700">
            Author name in papers:
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Enter name"
              className="mt-2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`bg-blue-700 text-white px-2 py-3 mt-[3%] mx-[10%] rounded-2xl text-lg font-semibold hover:bg-blue-800 hover:scale-95 cursor-pointer transition flex justify-center items-center ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Loading...' : 'Count first and second appearances'}
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>

        <div className="absolute absolute-center flex flex-col gap-5 text-gray-800 text-2xl z-0 font-medium text-start">
          <div>
            Total articles:{' '}
            {stats && <span className="text-green-500">{stats.totalArticles}</span>}
          </div>
          <div>
            First or second author count:{' '}
            {stats && <span className="text-green-500">{stats.firstOrSecondAuthorArticles}</span>}
          </div>
          {stats && (
            <button
              onClick={resetForm}
              className="bg-blue-700 text-white px-2 py-3 mt-[15%] mx-[10%] rounded-2xl text-lg font-semibold cursor-pointer hover:bg-blue-800 hover:scale-95 transition"
            >
              Check another author
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;