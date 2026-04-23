export interface Audio {
  id: number;
  original_text: string;
  rendered_text: string;
  language: string;
  speaker: string;
  mode: string;
  variant: string;
  instruction: string;
  filename: string;
  file_path: string;
  mime_type: string;
  sample_rate: number;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  created_at: string;
}

export interface AudioListResponse {
  audios: Audio[];
  total: number;
}

export interface GenerateRequest {
  text: string;
  language: string;
  speaker: string;
  mode: string;
  device: string;
}
