import { Audio, AudioListResponse, GenerateRequest } from "./types";

const API_BASE = "http://localhost:8001/api";

export async function generateAudio(req: GenerateRequest): Promise<Audio[]> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Generation failed" }));
    throw new Error(err.detail || "Generation failed");
  }
  return res.json();
}

export async function fetchAudios(params?: {
  search?: string;
  mode?: string;
  speaker?: string;
  sort?: string;
}): Promise<AudioListResponse> {
  const url = new URL(`${API_BASE}/audios`);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.mode) url.searchParams.set("mode", params.mode);
  if (params?.speaker) url.searchParams.set("speaker", params.speaker);
  if (params?.sort) url.searchParams.set("sort", params.sort || "newest");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch audios");
  return res.json();
}

export async function deleteAudio(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/audios/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete audio");
}

export function getAudioFileUrl(filename: string): string {
  return `${API_BASE}/files/${encodeURIComponent(filename)}`;
}
