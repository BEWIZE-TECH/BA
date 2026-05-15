

# BIWIZE User Guide

## Introduction

BIWIZE is an AI-powered platform engineered for advanced data processing and agentic workflows. This guide provides comprehensive, step-by-step instructions to set up, configure, and execute the application in both local and production environments.

* **Live Deployment:** [https://ba-lime.vercel.app/](https://ba-lime.vercel.app/)
* **Source Code:** [https://github.com/BEWIZE-TECH/BA.git](https://github.com/BEWIZE-TECH/BA.git)

---

## 1. Prerequisites

Before initiating the installation, ensure the following tools and components are installed and properly configured on your system:

* **Runtime Environment:** Node.js (Latest LTS version) and Python 3.10+
* **Vector Database:** ChromaDB (must be installed and running locally)
* **Database & Auth:** A Supabase account and an active project instance
* **LLM Provider:** A valid DeepSeek API key (configured within the n8n layer)
* **Automation Backend:** n8n (Desktop app or Docker container variant)

---

## 2. Installation & Local Setup

### Step 1: Clone the Repository

Open your terminal and clone the repository using the following commands:

```bash
git clone https://github.com/BEWIZE-TECH/BA.git
cd BA

```

### Step 2: Environment Configuration

Create a `.env` file in the root directory of your project and populate it with the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_N8N_URL=your_n8n_webhook_or_instance_url

```

### Step 3: Database Schema Setup (Supabase)

Log into your Supabase dashboard and ensure that your project database contains the following tables to successfully handle application logic:

| Table Name | Description |
| --- | --- |
| `user` | Stores user profiles, authentication metadata, and settings. |
| `projects` | Manages user-specific projects, configurations, and application states. |
| `chathistory` | Logs historical message arrays and AI agent interactions. |

---

## 3. System Execution

### Automated Startup

The repository provides an automated shell script to orchestrate and spin up both the frontend and backend services concurrently.

Run the following commands from the root directory:

```bash
# Grant execution permissions to the script
chmod +x start-biwize.sh

# Launch the BIWIZE software stack
./start-biwize.sh

```

---

## 4. Backend Workflow Configuration (n8n)

BIWIZE relies on **n8n** to manage its agentic backend architecture and third-party integrations.

1. Launch your local or cloud **n8n** instance.
2. Click on the workflow menu and select **Import from File**.
3. Locate and select the `n8n.json` file located in the root of the project repository.
4. Open the node configurations within the imported workflow to link your **DeepSeek API key** and **Supabase credentials**.
5. Click **Save** and switch the workflow toggle to **Active** to begin processing live frontend requests.

---

## 5. Deployment Notes

* **Frontend Hosting:** The user interface is optimized for Vercel. When deploying, ensure all variables defined in your local `.env` are mirrored in the **Vercel Project Environment Variables** settings.
* **ChromaDB Production:** For production builds, ensure ChromaDB is attached to a persistent volume or mapped to a secured, cloud-hosted instance rather than a volatile local memory stack.
* **Security Guardrails:** Never commit your active `.env` file or a modified `start-biwize.sh` script containing raw API keys to public source control.

---

---

# Repository README.md

```markdown
# BIWIZE — AI-Driven Data Processing & Agentic Workflows

BIWIZE is an enterprise-grade, AI-powered platform designed for orchestrating complex data processing tasks and multi-agent workflows. By leveraging a modern frontend stack seamlessly integrated with n8n, Supabase, ChromaDB, and DeepSeek, BIWIZE enables robust data engineering and contextual AI interactions.

## 🚀 Quick Links
- **Live Platform:** [ba-lime.vercel.app](https://ba-lime.vercel.app/)
- **Repository:** [github.com/BEWIZE-TECH/BA](https://github.com/BEWIZE-TECH/BA)

---

## 🛠️ Architecture & Tech Stack
- **Frontend:** Next.js (React Framework)
- **Workflow Engine:** n8n (Agentic backends & automation pipelines)
- **Database & Auth:** Supabase (PostgreSQL relational storage)
- **Vector Store:** ChromaDB (Local or cloud embedding retrieval)
- **LLM Engine:** DeepSeek API

---

## 📋 Prerequisites
Ensure you have the following dependencies running globally on your environment:
- **Node.js** (Latest LTS)
- **Python** 3.10+
- **ChromaDB** running locally (`chroma run`)
- **n8n** installed via Docker or npm

---

## ⚙️ Getting Started

### 1. Clone the project
```bash
git clone [https://github.com/BEWIZE-TECH/BA.git](https://github.com/BEWIZE-TECH/BA.git)
cd BA

```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_N8N_URL=your_n8n_instance_url

```

### 3. Database Preparation

Configure your **Supabase** instance with the following tables:

* `user`: User account management.
* `projects`: Metadata and structures for user workspaces.
* `chathistory`: Logs conversational strings and token updates.

### 4. Import n8n Workflow

* Open your n8n dashboard.
* Import the `n8n.json` file included in this repository.
* Attach your **DeepSeek API Key** and **Supabase Connection parameters** inside the corresponding nodes.
* Activate the workflow.

---

## 🏎️ Running the Application

To boot up the entire ecosystem automatically (Frontend dev server, local integrations, etc.), execute the utility shell script:

```bash
chmod +x start-biwize.sh
./start-biwize.sh

```

---

## 🔒 Security & Deployment

* **Vercel:** Optimized for direct Vercel imports. Bind your production variables inside Vercel's deployment dashboard.
* **Data Persistence:** Ensure ChromaDB is provisioned with proper volume mounts during production deployments to prevent vector loss.
* **Git Safety:** The `.env` file is excluded via `.gitignore`. Always keep credentials private.

```

```
