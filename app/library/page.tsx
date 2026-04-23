"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAudios } from "@/lib/api";
import { Audio } from "@/lib/types";
import AudioCard from "@/components/AudioCard";
import { Search, Filter, Loader2, RefreshCcw, Library } from "lucide-react";

export default function LibraryPage() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [speakerFilter, setSpeakerFilter] = useState("");
  const [sort, setSort] = useState("newest");

  const loadAudios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAudios({
        search: search.trim() || undefined,
        mode: modeFilter || undefined,
        speaker: speakerFilter || undefined,
        sort,
      });
      setAudios(res.audios);
    } catch (err: any) {
      setError(err.message || "Failed to load library");
    } finally {
      setLoading(false);
    }
  }, [search, modeFilter, speakerFilter, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAudios();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [loadAudios]);

  const handleDelete = (id: number) => {
    setAudios((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Audio Library</h1>
          <p className="mt-2 text-white/50">Browse and manage your generated pronunciations.</p>
        </div>
        <button
          onClick={loadAudios}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          title="Refresh"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search original text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-transparent bg-white/[0.04] pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          {/* Mode Filter */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <Filter size={14} />
            </div>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-xl border border-transparent bg-white/[0.04] pl-9 pr-8 text-sm text-white focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none"
            >
              <option value="">All Modes</option>
              <option value="full">Full Request</option>
              <option value="slow">Slow Request</option>
              <option value="word_by_word">Word-by-word Request</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 cursor-pointer appearance-none rounded-xl border border-transparent bg-white/[0.04] px-4 pr-8 text-sm text-white focus:border-indigo-500/50 focus:bg-white/[0.06] focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400">
          {error}
        </div>
      ) : loading && audios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <Loader2 size={32} className="animate-spin" />
          <p className="mt-4 text-sm">Loading library...</p>
        </div>
      ) : audios.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] border-dashed py-20 text-white/40">
          <Library size={48} className="mb-4 opacity-20" />
          <p>No audio files found.</p>
          {(search || modeFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setModeFilter("");
              }}
              className="mt-4 cursor-pointer text-sm text-indigo-400 hover:text-indigo-300"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {audios.map((audio) => (
            <AudioCard key={audio.id} audio={audio} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
