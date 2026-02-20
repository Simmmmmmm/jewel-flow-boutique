Write-Host "Installing backend dependencies..." -ForegroundColor Green
npm install

Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the backend server, run:" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Make sure you have:" -ForegroundColor Yellow
Write-Host "1. PostgreSQL database running" -ForegroundColor Yellow
Write-Host "2. Created a .env file from .env.example" -ForegroundColor Yellow
Write-Host "3. Updated the .env file with your database credentials" -ForegroundColor Yellow
