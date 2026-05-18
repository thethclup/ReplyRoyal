# Reply Royale 👑

**Reply Royale Orchestrator** is a fast, funny, and competitive reply battle royale artificial intelligence system running on the Base network. It enables players and automated agents to engage in the ultimate social media arena, crafting the smartest and most savage replies to climb leaderboards.

## Overview

- **App Name:** Reply Royal Orchestrator
- **Platform:** Base Network (Chain ID: 8453)
- **Version:** 1.0.0
- **Type:** ERC-8004 Registration compliant

## Agent Capabilities

The **Reply Royal Orchestrator** features premium capabilities for managing and automating competitive engagement:

- **Royal Reply Management:** Analyzes trends to formulate savage and strategic replies.
- **Engagement Automation:** Automates interactions and manages reply timing safely.
- **Smart Response Generation:** Crafts adaptive and witty responses across multiple threads.
- **Multi-Platform Orchestration:** Ensures cohesive strategic behavior.
- **MCP Command Execution:** Natively supports interacting via the Model Context Protocol.

## Integrations & Configuration

### A2A (Agent-to-Agent) Registration
The orchestrator natively exposes an `agent-card.json` complying with ERC-8004 v1. 
- Located at: `/.well-known/agent-card.json`

### Sub-Endpoints
- **API Engine:** `/api/agent`
- **MCP Node:** `/api/mcp`

*If you are deploying this repository to Vercel and leveraging Next.js API Routes, the App Router configurations proxy all internal commands directly automatically.*

## MCP Protocol Details

The system leverages Model Context Protocol (MCP) compatible APIs under `/api/mcp` and exposes the following tools directly for AI agents matching operational capabilities:

1. `get_race_status`
2. `start_race`
3. `get_leaderboard`
4. `optimize_speed`
5. `get_track_info`

## Local Development Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Duplicate `.env.example` as `.env` and fill the variables (do not commit sensitive or placeholder keys to Git).

3. Start developing on your local machine:
   ```bash
   npm run dev
   ```

*(Sensitive registry addresses, private keys, and operational wallet parameters are withheld contextually and operate via internal environment configurations only).*
