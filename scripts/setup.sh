#!/bin/bash

echo "🚀 Setting up 20xdev with WorkOS + Convex..."
echo ""

# Check if .env exists
if [[ ! -f .env ]]; then
  echo "❌ .env file not found!"
  echo "Creating .env from .env.example..."
  cp .env.example .env
fi

echo "Step 1: Installing dependencies..."
bun install

echo ""
echo "Step 2: Initializing Convex..."
echo "This will open your browser to create/link a Convex deployment."
echo "The deployment URL will be automatically added to your .env.local file."
echo ""

npx convex dev --once

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your actual WorkOS credentials"
echo "2. Run 'npx convex dev' in one terminal"
echo "3. Run 'bun dev' in another terminal"
echo ""
