#!/bin/bash

echo "🧹 Cleaning up old environment..."

if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "✅ Removed node_modules"
else
    echo "ℹ️ node_modules not found, skipping removal"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    echo "✅ Removed package-lock.json"
else
    echo "ℹ️ package-lock.json not found, skipping removal"
fi

echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

SOURCE="node_modules/@babel/runtime/helpers/esm/regeneratorValues.js"
TARGET="node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/regeneratorValues.js"

if [ -f "$SOURCE" ]; then
    echo "🔗 Copying regeneratorValues.js to nested Babel runtime..."
    cp "$SOURCE" "$TARGET"
else
    echo "⚠️ regeneratorValues.js not found at expected source path."
fi

if [ "$CI" != "true" ]; then
    echo "🚀 Starting Angular project locally..."
    npm start
else
    echo "🏃 Skipping npm start in CI environment"
fi

echo "✅ Setup complete"
