# FrenchToSpeech 🇫🇷 (Frontend)

The modern, beautiful web frontend for the FrenchToSpeech local-first pronunciation training application.

## Features

- **Beautiful UI**: Built with Next.js and Tailwind CSS, featuring a responsive, dark glassmorphism aesthetic.
- **Audio Controls**: Custom audio player with playback speed controls (0.5x to 1.5x).
- **Generator Page**: Dynamic user input with device (MPS/CPU) and mode toggles.
- **Library Page**: Browse past pronunciations with debounced search and filtering.

---

## Prerequisites

- **Node.js 18+**

---

## Setup Instructions

```bash
# Install dependencies
npm install

# Start the development server (runs on port 8000)
npm run dev
```

### Usage

1. Make sure the FastAPI backend is running (see [backend/README.md](https://github.com/nitesw/FrenchToSpeech_FastAPI/blob/main/README.md)).
2. Open your browser and navigate to `http://localhost:8000`.
3. Enter the French phrase you want to practice.
4. Select your device (`CUDA` for Nvidia GPUs on Windows/Linux, or `MPS` for Apple Silicon Macs).
5. Click **Generate Pronunciation**.
6. Listen, download, or manage your generations in the **Library** tab.

---

## Tech Stack

- **Framework**: Next.js 15, React 19
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
