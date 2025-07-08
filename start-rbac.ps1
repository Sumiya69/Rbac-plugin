# PowerShell script to start RBAC server
Write-Host "Starting RBAC Server on port 8080..." -ForegroundColor Green

# Change to the app directory
Set-Location "c:\Users\ShaikSumiya\sampleapp"

# Start the server
try {
    Write-Host "Executing: node minimal-rbac-server.js" -ForegroundColor Yellow
    & node minimal-rbac-server.js
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
