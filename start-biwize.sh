#!/bin/bash

# --- BIWIZE Local-Only Neural Node Script ---
echo "Initializing BIWIZE Local-Only Intelligence Stack..."

# 1. Set CORS for Local environment
# We only need to allow our local dashboard port
export N8N_CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3002"
export OLLAMA_ORIGINS="http://localhost:5678,http://localhost:3000,http://localhost:3002"

# 2. Reset Ollama Service
echo "Ensuring Ollama is running locally..."
# Stop background service to ensure our CORS settings apply
sudo systemctl stop ollama > /dev/null 2>&1
sudo fuser -k 11434/tcp > /dev/null 2>&1

# Start Ollama in background
ollama serve > /dev/null 2>&1 &
OLLAMA_PID=$!

echo " Initializing ChromaDB on port 8000..."
# We explicitly allow n8n (5678) and your Dashboard (3002) to connect
export CHROMA_SERVER_CORS_ALLOW_ORIGINS='["http://localhost:5678", "http://localhost:3002"]'

# Start ChromaDB
chroma run --host localhost --port 8000 > /dev/null 2>&1 &
CHROMA_PID=$!

# 4. Start n8n (LOCAL MODE)
# We removed --tunnel so it stays on your machine
echo "Initializing n8n on http://localhost:5678..."
npx n8n start > /dev/null 2>&1 &
N8N_PID=$!

# Give services time to stabilize
echo " Waiting for neural links to stabilize..."
sleep 6

# 5. Open Browser to Dashboard and n8n
echo "LOCAL NEURAL LINK ESTABLISHED"
xdg-open "http://localhost:3002/" > /dev/null 2>&1
xdg-open "http://localhost:5678/" > /dev/null 2>&1

# 6. Start the Next.js Frontend
echo " Launching BIWIZE Frontend on Port 3002..."
npm run dev 

# Cleanup: Kill everything when you press Ctrl+C
trap "kill $CHROMA_PID $N8N_PID $OLLAMA_PID; echo 'Stopping BIWIZE Local Services...'; exit" SIGINT