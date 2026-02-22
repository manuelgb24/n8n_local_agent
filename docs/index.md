# 🧠 n8n Local AI Workflow Engineering Agent  
### AI-Governed Workflow Engineering (MCP + Local LLM + Phase Control)

---

## 🎬 Live Demo

[▶ Click here to watch the demo](0213.mp4)

---

## 🧠 What This Project Does

This project implements a **local-first AI workflow engineering system** capable of designing and generating structured n8n workflows under strict governance rules.

To demonstrate the system, a real-world automation was engineered:

YouTube URL → Transcript → Local AI Summary → Email

Everything runs locally.  
No paid APIs.  
No OpenAI.  
No external SaaS dependencies.

---

## ⚙️ How The Demo Workflow Works

Manual Trigger (n8n)
↓  
Extract YouTube Video ID  
↓  
Fetch Captions (Spanish first)  
↓  
Fallback to English captions  
↓  
Fallback to local Whisper transcription (if needed)  
↓  
Normalize transcript text  
↓  
Send transcript to local LLM (Ollama – Gemma 3 12B)  
↓  
Generate structured summary  
↓  
Send formatted email (only if summary is valid)

If transcript or summary fails → execution ends silently.

---

## 🏗 Architecture Overview

The system is intentionally layered:

- 🧠 Codex (GPT-5.3) → Plans and structures workflows
- 📜 `claude.md` → Governance layer (rules + constraints)
- 🧩 `n8n-skills` → Workflow design patterns
- 🔌 `n8n-mcp` → Direct execution bridge to n8n
- 🐳 n8n (Docker) → Orchestration layer
- 🎙 Whisper (local) → ASR fallback
- 🤖 Ollama (local) → LLM summarization
- 📧 SMTP → Email output

All inference is local.

---

## 🎯 Engineering Highlights

- Multi-branch fallback logic (ES → EN → Whisper)
- Local ASR + Local LLM orchestration
- Structured output validation
- HTML + text email formatting
- Silent failure design (signal-only output)
- Phase-based workflow construction
- Zero external AI APIs

---

## 🔒 Why This Matters

Most AI automations rely on SaaS APIs and uncontrolled prompts.

This project demonstrates:

AI as an engineering system — not a shortcut tool.

It enforces:

- Cost control  
- Infrastructure independence  
- Maintainability  
- Deployment discipline  

---

## 📂 Repository

Explore the full workflow JSON and architecture in the main repository.
