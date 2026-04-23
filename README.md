# 🗳️ VoteWise — Election Process Education AI Assistant

**Hack2Skill Hackathon 2026 | Challenge: Election Process Education**

[![Deployed on Cloud Run](https://img.shields.io/badge/Google%20Cloud-Run-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%201.5-8A2BE2?logo=google&logoColor=white)](https://ai.google.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-brightgreen)](https://www.w3.org/WAI/WCAG21/Understanding/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Overview

**VoteWise** is an AI-powered web application that educates Indian citizens about the democratic election process. It makes civic education accessible, interactive, and available in 6 Indian languages — empowering every citizen to become an informed voter.

---

## 🏹 Chosen Vertical

**Election Process Education** — Helping citizens understand how India's elections work, their voting rights, and how to participate meaningfully in democracy.

---

## ✨ Features

| Feature | Description | Technology |
|------|-------------|------------|
| 🤖 **AI Chatbot** | Election Q&A with conversation history | Google Gemini 1.5 Flash |
| 📍 **Polling Booth Finder** | Locate nearby polling stations | Google Maps + Places API |
| 📝 **Knowledge Quiz** | 30 questions, 3 difficulty levels | Vanilla JS |
| 🗓️ **Election Timeline** | Visual 9-step election process guide | CSS animations |
| 🌐 **Multi-Language** | 6 Indian languages with batched translation | Google Cloud Translation API |
| 🔊 **Text-to-Speech** | AI responses read aloud for accessibility | Web Speech API |
| 🎤 **Voice Input** | Voice questions via browser microphone | Web Speech Recognition API |

---

## 🏗️ Architecture

```
election-edu-assistant/
├── index.html              # SPA entry point — semantic HTML5, ARIA compliant
├── app.js                  # Main controller — navigation, language, keyboard shortcuts
├── style.css               # Design system — CSS variables, responsive, animations
│
├── components/
│   ├── chatbot.js          # Chat UI — message rendering, TTS, voice input
│   ├── quiz.js             # Quiz engine — 30 questions, scoring, feedback
│   └── timeline.js         # Scroll animation — IntersectionObserver
│
├── services/
│   ├── gemini.js           # Gemini API — chat completions, safety settings
│   ├── maps.js             # Google Maps — dynamic load, Places search, geocoding
│   └── translate.js        # Translation API — batch translation, caching
│
├── tests/
│   └── app.test.js         # Jest tests — quiz, formatting, API, accessibility
│
├── Dockerfile              # Cloud Run deployment — node:18-alpine + http-server
└── README.md
```

---

## 🔧 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+ — no frameworks)
- **AI**: Google Gemini 2.0 Flash API (REST via `fetch`)
- **Maps**: Google Maps JavaScript API + Places API + Geometry Library
- **Translation**: Google Cloud Translation API v2 (batched, cached)
- **TTS**: Web Speech API (browser-native, no external dependency)
- **Voice Input**: Web Speech Recognition API (Chrome/Edge)
- **Testing**: Jest
- **Deployment**: Google Cloud Run (Dockerized)

---

## 🖥️ Google Services Used

| Service | Purpose |
|---------|---------|
| **Google Gemini 1.5 Flash** | AI election Q&A chatbot with election-specific system prompt |
| **Google Maps JavaScript API** | Interactive map for polling booth finder |
| **Google Places API** | Nearby location search for polling stations |
| **Google Maps Geocoding** | Address-to-coordinates conversion |
| **Google Cloud Translation API** | Batch multi-language support |
| **Google Cloud Run** | Serverless container deployment |

---

## ♿ Accessibility (WCAG 2.1 AA)

- ✅ Skip navigation link
- ✅ Full keyboard navigation (Tab, Enter, Escape, Alt+1-5 tab shortcuts)
- ✅ ARIA roles, labels, and live regions (`aria-live="polite/assertive"`)
- ✅ Screen reader compatible (semantic HTML5: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`)
- ✅ Focus management on tab switch
- ✅ High-contrast color scheme (4.5:1+ contrast ratio)
- ✅ Text-to-speech for all AI responses
- ✅ Voice input support
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ `prefers-reduced-motion` compatible animations

---

## 🚀 Setup Instructions

### 1. Clone & Configure API Keys

```bash
git clone https://github.com/YOUR_USERNAME/votewise-election-edu.git
cd votewise-election-edu
```

Open the following files and replace the placeholder API keys:

| File | Variable | Get Key From |
|------|----------|-------------|
| `services/gemini.js` | `GEMINI_CONFIG.API_KEY` | [Google AI Studio](https://aistudio.google.com/) |
| `services/maps.js` | `MAPS_CONFIG.API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) |
| `services/translate.js` | `TRANSLATE_CONFIG.API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) |

### 2. Enable Google Cloud APIs

In your [Google Cloud Console](https://console.cloud.google.com/):
- ✅ Gemini API (via Google AI Studio)
- ✅ Maps JavaScript API
- ✅ Places API
- ✅ Geocoding API
- ✅ Cloud Translation API

### 3. Run Locally

```bash
# Option A: Python (no install needed)
python -m http.server 8080

# Option B: Node.js http-server
npx http-server -p 8080

# Option C: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Open: http://localhost:8080

### 4. Run Tests

```bash
npm install
npx jest tests/app.test.js --verbose
```

---

## ☁️ Deploy to Google Cloud Run

```bash
# 1. Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Deploy from source (builds Docker image automatically)
gcloud run deploy votewise \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1

# 3. Get the deployed URL
gcloud run services describe votewise \
  --region asia-south1 \
  --format 'value(status.url)'
```

---

## 🧠 How the AI Works

The chatbot uses a carefully crafted **election-specific system prompt** injected alongside every user message. The prompt:

1. Defines VoteWise's identity and expertise domain
2. Lists comprehensive election knowledge: voter registration forms, EVM/VVPAT details, RPA 1951, MCC rules, constituency delimitation, NOTA, anti-defection law, and more
3. Enforces strict **non-partisanship** — declines to comment on specific candidates or parties
4. Adapts response language based on the selected regional language
5. Provides official sources: `eci.gov.in`, `voterportal.eci.gov.in`, `nvsp.in`

Multi-turn **conversation history** (last 6 exchanges) is maintained for contextual follow-up questions.

---

## 📊 Quiz System

| Difficulty | Topics Covered |
|------------|---------------|
| 🟢 **Beginner** | Voting age, EVM, voter ID, NOTA, ECI, registration website |
| 🟡 **Intermediate** | Security deposit, by-elections, anti-defection, MCC, Rajya Sabha term |
| 🔴 **Advanced** | 61st Amendment, PUCL vs Union of India, RPA 1951 Sec 8, indelible ink chemistry, electoral bonds SC ruling |

Questions are randomized per session. Each answer includes a detailed explanation for learning.

---

## 🌐 Translation System

- Batched API calls (10 texts per request) for efficiency
- Client-side **LRU cache** to avoid duplicate API calls
- Original text preserved via `data-original` attributes for reverting to English
- Graceful fallback to original text if API key is not configured

---

## 🔒 Security

- All API keys are client-side in this demo (replace with server-side proxy for production)
- User input is HTML-escaped before rendering (XSS prevention)
- Gemini safety settings: `BLOCK_MEDIUM_AND_ABOVE` for dangerous content and harassment
- 30-second fetch timeout with `AbortSignal.timeout()`
- No sensitive user data is stored or transmitted beyond the API calls

---

## 📋 Assumptions

- Users have modern browsers (Chrome 90+, Edge 90+, Firefox 88+, Safari 14+)
- Polling booth locations are approximate — official ECI booth data is not available via public API; nearby government/public buildings are shown as proxies
- Election information is based on Indian General Elections (Lok Sabha) with references to State Assembly elections
- API keys must be individually configured before deployment

---

## 📌 Submission Checklist

- [x] GitHub repo is **PUBLIC**
- [x] Only **ONE branch** (main)
- [x] Repo size **< 1 MB**
- [x] Dockerfile included for **Cloud Run** deployment
- [x] Challenge: **Election Process Education**
- [ ] Cloud Run URL (add after deployment)
- [ ] LinkedIn post (create after deployment)

---

## 📚 References

- [Election Commission of India](https://eci.gov.in)
- [National Voter's Service Portal](https://voterportal.eci.gov.in)
- [NVSP](https://nvsp.in)
- Representation of People Act, 1951
- Constitution of India — Article 324–329 (Elections)
- PUCL vs Union of India, 2013 (NOTA)
- Association for Democratic Reforms vs Union of India, 2024 (Electoral Bonds)

---

*Built with ❤️ for Indian democracy | Hack2Skill 2026*
