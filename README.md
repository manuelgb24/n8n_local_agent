# n8n Local AI Workflow Engineering Agent

This project is not a simple automation script.

It is a local-first AI engineering system designed to **think, structure and deploy n8n workflows with architectural discipline**, instead of blindly generating automation snippets.

It combines a governance-driven system prompt, direct MCP integration and local LLM execution to create structured, maintainable workflows without relying on SaaS AI APIs.

---

## Why this project exists

n8n is extremely powerful.

But designing complex workflows at production quality is not trivial.  
It requires:

- Clear architectural thinking  
- Controlled deployment  
- Explicit cost governance  
- Structured error handling  
- Maintainable graph design  

Most AI-assisted automation approaches today:

- Depend on OpenAI or external APIs  
- Use opaque prompts  
- Generate large uncontrolled flows  
- Ignore operational constraints  

That works for demos.

It does not work for real systems.

This project explores a different idea:

> What if an AI agent could engineer workflows with constraints, governance and architectural structure — fully local?

---

## What this repository implements

This repository contains the foundation of a locally governed AI workflow engineering system.

It includes:

- A structured system prompt (`claude.md`) that defines strict engineering rules  
- Direct MCP integration with n8n  
- Local LLM execution via Ollama  
- A phase-based workflow generation model  
- Strict cost restrictions (no paid APIs)  
- Human validation before activation  

The agent does not just “generate JSON”.

It reasons about architecture.  
It splits complexity into phases.  
It respects operational constraints.  

It behaves like an automation engineer — not a chatbot.

---

## Core principles

### Local-first

- All AI inference runs locally (Ollama)
- No OpenAI
- No SaaS AI services
- No hidden API costs

### Governance over generation

The system prompt enforces:

- Clear node naming
- Explicit error branches
- Efficient resource usage
- Dev → staging → production mindset
- No automatic activation without review

### Phase-based workflow construction (anti-chaos model)

Instead of generating massive workflows in one shot, the agent works incrementally:

1. Generates a JSON phase inside `workflows/`
2. The workflow is reviewed and validated inside n8n
3. Only then is the next phase generated

This dramatically reduces:
- UI corruption risk
- Over-complex graphs
- Logical inconsistencies

Complex systems are built progressively.

---

## High-level architecture

User
↓
VS Code + Codex (GPT-5.3)
↓
System Prompt (claude.md)
↓
Knowledge Layer (vendor/n8n-skills)
↓
Execution Layer (vendor/n8n-mcp)
↓
n8n (self-hosted, Docker)


### Components explained

**Codex (GPT-5.3)**  
The reasoning engine responsible for planning and generating structured workflows.

**claude.md**  
The governance layer.  
Defines rules, constraints, cost policies and workflow quality standards.

**n8n-skills**  
A curated knowledge base of professional workflow patterns and best practices.

**n8n-mcp**  
The execution bridge allowing the agent to create and modify workflows directly in n8n.

**n8n (Docker)**  
The target runtime environment where workflows are deployed and validated.

---

## Demonstration project

To validate the system, a full real-world workflow was engineered:

### YouTube → Transcript → Local AI Summary → Email

This workflow:

- Accepts a YouTube URL manually
- Extracts captions (Spanish first, English fallback)
- If captions are unavailable, uses a local Whisper microservice
- Normalizes transcript text
- Sends transcript to Ollama (`gemma3:12b`)
- Generates structured summary (bullets + conclusions)
- Sends formatted email (HTML + text)
- Silently terminates if transcript or summary fails
- Uses zero paid APIs
- Runs entirely local

The full workflow JSON is available in the `workflows/` directory.

This demo proves:

- Multi-branch fallback logic  
- Hybrid scraping + ASR design  
- LLM orchestration  
- HTML email formatting  
- Operational robustness  
- Controlled failure behavior  

---

## Repository structure

n8n_local_agent/
│
├── claude.md # Governance system prompt
├── .mcp.json.example # MCP configuration template
├── services/
│ └── whisper-local/ # Local ASR fallback service
├── vendor/
│ ├── n8n-mcp/ # Vendored execution bridge
│ └── n8n-skills/ # Vendored workflow knowledge base
├── workflows/ # Generated workflow phases and demos
└── README.md


---

## Philosophy

This is not about automating small tasks.

It is about building **AI-governed automation systems** that respect:

- Infrastructure constraints  
- Cost control  
- Maintainability  
- Deployment discipline  

The goal is simple:

> Use AI as an engineering assistant — not as a shortcut generator.

---

## License

This project includes vendored open-source dependencies.
Each dependency retains its original license.

Core project license: MIT.
