#!/bin/bash
# Build macOS .dmg installer
# This script must be run on macOS

set -e

echo "Building Mood Tracker for macOS..."
echo "=================================="
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "⚠️  Warning: This script should be run on macOS to create .dmg files"
    echo "   You can still create .zip distributions on Linux/Windows"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Build frontend
echo ""
echo "🔨 Building frontend..."
cd frontend && npm run build && cd ..

# Build macOS app
echo ""
echo "📦 Building macOS application..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # On macOS, build DMG
    npm run package:mac
    echo ""
    echo "✅ Build complete!"
    echo ""
    echo "📂 Output location: dist-electron/"
    echo ""
    ls -lh dist-electron/*.dmg 2>/dev/null || echo "   Mood Tracker.dmg"
    echo ""
else
    # On Linux/Windows, build ZIP
    npx electron-builder build --mac zip --config electron-builder.json
    echo ""
    echo "✅ Build complete!"
    echo ""
    echo "📂 Output location: dist-electron/"
    echo ""
    ls -lh dist-electron/*.zip 2>/dev/null || echo "   Mood Tracker-1.0.0-mac.zip"
    echo ""
    echo "⚠️  Note: .dmg files can only be built on macOS"
    echo "   The .zip file can be distributed and will work on macOS"
fi

echo "🎉 Done! You can now distribute the macOS application."
