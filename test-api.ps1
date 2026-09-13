$body = '{"crop":"Chilli","fileName":"chilli-leaf.jpg","imageBase64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}'

Write-Host "=== Testing Crop Doctor API ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Health Check:" -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET
Write-Host "   Status : $($health.status)" -ForegroundColor Green
if ($health.geminiConfigured) {
    Write-Host "   AI Mode: LIVE Gemini AI Enabled" -ForegroundColor Green
} else {
    Write-Host "   AI Mode: Demo Mode (ICAR Database)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "2. Crop Doctor Diagnosis:" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/crop-doctor/analyze" -Method POST -Body $body -ContentType "application/json"

if ($response.success) {
    Write-Host "   STATUS    : WORKING OK" -ForegroundColor Green
    Write-Host "   Crop      : $($response.diagnosis.crop)"
    Write-Host "   Disease   : $($response.diagnosis.name)"
    Write-Host "   Severity  : $($response.diagnosis.severity)/5"
    Write-Host "   Confidence: $($response.diagnosis.confidence)%"
    if ($response.aiResearched) {
        Write-Host "   Source    : LIVE Gemini Vision AI" -ForegroundColor Green
    } else {
        Write-Host "   Source    : ICAR Demo Mode" -ForegroundColor Yellow
    }
    Write-Host "   Spray Time: $($response.diagnosis.bestSprayTime)"
    Write-Host "   Water Vol : $($response.diagnosis.waterVolume)"
} else {
    Write-Host "   FAILED" -ForegroundColor Red
}
