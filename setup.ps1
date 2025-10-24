Write-Host "🧹 Cleaning up old environment..."

if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ Removed node_modules"
} else {
    Write-Host "ℹ️ node_modules not found, skipping removal"
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ Removed package-lock.json"
} else {
    Write-Host "ℹ️ package-lock.json not found, skipping removal"
}

Write-Host "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps
npm install wait-on --save-dev --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed"
    exit 1
}

$source = "node_modules/@babel/runtime/helpers/esm/regeneratorValues.js"
$target = "node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/regeneratorValues.js"

if (Test-Path $source) {
    Write-Host "🔗 Copying regeneratorValues.js to nested Babel runtime..."
    Copy-Item -Path $source -Destination $target -Force
} else {
    Write-Host "⚠️ regeneratorValues.js not found at expected source path."
}

if ($env:CI -ne "true") {
    Write-Host "🚀 Starting Angular project locally..."
    npm start
} else {
    Write-Host "🏃 Skipping npm start in CI environment"
}
