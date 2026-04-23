"use client";

import { useState, useEffect } from "react";
import { Mic2, Settings2, Cpu, Zap, Loader2, Sparkles } from "lucide-react";
import { generateAudio } from "@/lib/api";
import { Audio } from "@/lib/types";
import AudioCard from "@/components/AudioCard";

export default function GeneratorPage() {
  const [text, setText] = useState("");
  const [speaker, setSpeaker] = useState("Ryan");
  const [mode, setMode] = useState("full");
  const [device, setDevice] = useState("cpu");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentAudios, setRecentAudios] = useState<Audio[]>([]);
  const [os, setOs] = useState<"mac" | "win" | "other">("other");

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf("mac") !== -1) {
      setOs("mac");
    } else if (ua.indexOf("win") !== -1) {
      setOs("win");
    }
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const newAudios = await generateAudio({
        text: text.trim(),
        language: "French",
        speaker,
        mode,
        device,
      });
      
      setRecentAudios((prev) => [...newAudios, ...prev]);
      setText(""); // Optional: clear text on success
    } catch (err: any) {
      setError(err.message || "Failed to generate audio");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveRecent = (id: number) => {
    setRecentAudios((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Pronunciation</span>
        </h1>
        <p className="mt-3 text-lg text-white/50">
          Enter French text to create high-quality, local pronunciation audio.
        </p>
      </div>

      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-6">
          {/* Text Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              French Text
            </label>
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Je mange avec une fourchette..."
                className="min-h-[140px] w-full resize-y rounded-2xl border border-white/[0.1] bg-black/40 p-5 pr-12 text-[15px] leading-relaxed text-white placeholder:text-white/20 focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
              <div className="absolute right-4 top-5 text-white/20">
                <Mic2 size={20} />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
                <Settings2 size={16} />
                Speaker
              </label>
              <select
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/[0.1] bg-black/40 px-4 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="Ryan">Ryan (Male)</option>
                {/* Add more speakers if supported by the model in the future */}
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
                <Sparkles size={16} />
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/[0.1] bg-black/40 px-4 text-sm text-white focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="full">Full (Normal + Word-by-word)</option>
                <option value="slow">Just Slow</option>
                <option value="word_by_word">Just Word-by-word</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
                {device === "mps" || device === "cuda" ? <Zap size={16} /> : <Cpu size={16} />}
                Compute Device
              </label>
              <div className="flex h-12 rounded-xl border border-white/[0.1] bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setDevice("cpu")}
                  className={`flex-1 cursor-pointer rounded-lg text-sm font-medium transition-all ${
                    device === "cpu"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  CPU
                </button>
                {os === "mac" && (
                  <button
                    type="button"
                    onClick={() => setDevice("mps")}
                    className={`flex-1 cursor-pointer rounded-lg text-sm font-medium transition-all ${
                      device === "mps"
                        ? "bg-indigo-500/20 text-indigo-300 shadow-sm"
                        : "text-white/40 hover:text-white/70"
                    }`}
                    title="Mac (Apple Silicon)"
                  >
                    MPS
                  </button>
                )}
                {os !== "mac" && (
                  <button
                    type="button"
                    onClick={() => setDevice("cuda")}
                    className={`flex-1 cursor-pointer rounded-lg text-sm font-medium transition-all ${
                      device === "cuda"
                        ? "bg-emerald-500/20 text-emerald-300 shadow-sm"
                        : "text-white/40 hover:text-white/70"
                    }`}
                    title="Windows/Linux (Nvidia GPU)"
                  >
                    CUDA
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-indigo-500/25 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating Audio...
              </>
            ) : (
              <>
                <Sparkles size={18} className="transition-transform group-hover:scale-110" />
                Generate Pronunciation
              </>
            )}
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent mix-blend-overlay"></div>
          </button>
        </div>
      </div>

      {/* Recent Outputs */}
      {recentAudios.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white/90">Recent Generations</h2>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/40">
              Session only
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentAudios.map((audio) => (
              <AudioCard key={audio.id} audio={audio} onDelete={handleRemoveRecent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
