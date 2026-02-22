# n8n Local AI Workflow Engineering Agent

A local-first AI engineering system capable of designing, generating and deploying structured n8n workflows using a governance-driven system prompt and direct MCP integration.

---

## Why this project exists

Designing complex n8n workflows at production quality requires:

- Structured architecture thinking
- Cost governance
- Clear error handling
- Maintainability
- Controlled deployment

Most AI-assisted automation tools rely on SaaS APIs, opaque prompts, and uncontrolled execution.

This project explores a different approach:

> A locally-governed AI agent that can engineer workflows with architectural discipline and operational constraints.

---

## What this is

This repository implements:

- A governance-driven system prompt (`claude.md`)
- Direct MCP integration with n8n
- Local LLM usage (Ollama)
- Structured workflow generation
- Phase-based workflow construction
- Cost-restricted, SaaS-free execution model

The agent does not just generate snippets.
It engineers workflows.

---

## Core principles

- Local-first execution
- No OpenAI / external paid APIs
- Explicit cost governance
- Dev → validation → production mindset
- Human validation before activation
- Incremental workflow construction by phases
