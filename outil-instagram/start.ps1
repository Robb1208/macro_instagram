# Regenerate player + logo indexes, then start dev server
$root = $PSScriptRoot

# Players
$playerDir = Join-Path $root "PLAYER_IMAGES"
if (Test-Path $playerDir) {
    $files = Get-ChildItem $playerDir -File | Where-Object { $_.Name -ne "players.json" } | Select-Object -ExpandProperty Name
    $json = if ($files.Count -eq 0) { "[]" } else { $files | ConvertTo-Json }
    [System.IO.File]::WriteAllText((Join-Path $playerDir "players.json"), $json, [System.Text.Encoding]::UTF8)
    Write-Host "players.json: $($files.Count) images"
}

# Logos
$logoDir = Join-Path $root "LOGOS_TEAMS"
if (Test-Path $logoDir) {
    $files = Get-ChildItem $logoDir -File -Filter "*.png" | Select-Object -ExpandProperty Name
    $json = if ($files.Count -eq 0) { "[]" } else { $files | ConvertTo-Json }
    [System.IO.File]::WriteAllText((Join-Path $logoDir "logos.json"), $json, [System.Text.Encoding]::UTF8)
    Write-Host "logos.json: $($files.Count) logos"
}

# Start server
$port = if ($env:PORT) { $env:PORT } else { "8123" }
npx -y http-server $root -p $port -c-1
