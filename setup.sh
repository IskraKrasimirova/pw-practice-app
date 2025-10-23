#!/bin/bash

echo "✅ Cleaning up old environment..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

SOURCE="node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"
DESTINATION="node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js"

if [ -f "$SOURCE" ]; then
    echo "📁 Copying regeneratorRuntime.js to nested Babel runtime..."
    cp "$SOURCE" "$DESTINATION"
else
    echo "❌ regeneratorRuntime.js not found at expected source path."
fi

echo "🚀 Starting Angular project..."
npm start