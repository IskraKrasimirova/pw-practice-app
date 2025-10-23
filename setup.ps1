Write-Host "🧹 Cleaning up old environment..."
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

Write-Host "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

$source = "node_modules/@babel/runtime/helpers/esm/regeneratorValues.js"
$target = "node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/regeneratorValues.js"

if (Test-Path $source) {
    Write-Host "🔗 Copying regeneratorValues.js to nested Babel runtime..."
    Copy-Item -Path $source -Destination $target -Force
} else {
    Write-Host "⚠️ regeneratorValues.js not found at expected source path."
}

Write-Host "🚀 Starting Angular project..."
npm start