"use client";

import { Audio } from "@/lib/types";
import { getAudioFileUrl, deleteAudio } from "@/lib/api";
import {
  Play,
  Pause,
  Download,
  Trash2,
  Clock,
  User,
  Layers,
  FileAudio,
} from "lucide-react";
import { useRef, useState } from "react";

interface AudioCardProps {
  audio: Audio;
  onDelete?: (id: number) => void;
}

const MODE_COLORS: Record<string, string> = {
  full: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  slow: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  word_by_word: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const VARIANT_LABELS: Record<string, string> = {
  full_sentence: "Full",
  slow_sentence: "Slow",
  word_by_word: "Word by Word",
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AudioCard({ audio, onDelete }: AudioCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioUrl = getAudioFileUrl(audio.filename);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    el.currentTime = x * el.duration;
    setProgress(x * 100);
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteAudio(audio.id);
      onDelete?.(audio.id);
    } catch {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = audio.filename;
    a.click();
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-lg hover:shadow-black/20">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Top row: play + text */}
      <div className="flex items-start gap-4">
        <button
          onClick={togglePlay}
          className="mt-0.5 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 transition-all duration-200 hover:scale-105 hover:bg-indigo-500/30 hover:text-indigo-300 active:scale-95"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-snug text-white/90 line-clamp-2">
            {audio.original_text}
          </p>
          {audio.rendered_text !== audio.original_text && (
            <p className="mt-1 text-[13px] leading-snug text-white/40 line-clamp-1 font-mono">
              {audio.rendered_text}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="mt-4 h-1 w-full cursor-pointer rounded-full bg-white/[0.06] overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Badges row */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${MODE_COLORS[audio.variant] || MODE_COLORS[audio.mode] || "bg-white/5 text-white/60 border-white/10"}`}
        >
          <Layers size={12} />
          {VARIANT_LABELS[audio.variant] || audio.variant}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/50">
          <User size={12} />
          {audio.speaker}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/50">
          <Clock size={12} />
          {formatDuration(audio.duration_seconds)}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/50">
          <FileAudio size={12} />
          {formatSize(audio.file_size_bytes)}
        </span>
      </div>

      {/* Speed controls */}
      <div className="mt-3 flex items-center gap-1.5">
        {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
          <button
            key={rate}
            onClick={() => changeSpeed(rate)}
            className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
              playbackRate === rate
                ? "bg-white/20 text-white"
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            {rate}x
          </button>
        ))}
      </div>

      {/* Footer: date + actions */}
      <div className="mt-3.5 flex items-center justify-between">
        <span className="text-xs text-white/30">{formatDate(audio.created_at)}</span>

        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={handleDownload}
            className="cursor-pointer rounded-lg p-2 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            title="Download"
          >
            <Download size={15} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="cursor-pointer rounded-lg p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
