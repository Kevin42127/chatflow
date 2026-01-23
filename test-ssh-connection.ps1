# 測試 SSH 連接腳本
param(
    [string]$HostName = "macincloud"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  測試 SSH 連接" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$sshConfigPath = "$env:USERPROFILE\.ssh\config"
$sshConfigExists = Test-Path $sshConfigPath

if (-not $sshConfigExists) {
    Write-Host "錯誤: 找不到 SSH 設定檔 ($sshConfigPath)" -ForegroundColor Red
    Write-Host ""
    Write-Host "請先建立 SSH config 檔案：" -ForegroundColor Yellow
    Write-Host "1. 建立資料夾: New-Item -ItemType Directory -Force -Path `"$env:USERPROFILE\.ssh`"" -ForegroundColor Gray
    Write-Host "2. 建立 config 檔案並加入以下內容：" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Host macincloud" -ForegroundColor White
    Write-Host "    HostName [你的 MacinCloud IP 或主機名]" -ForegroundColor White
    Write-Host "    User [你的 MacinCloud 用戶名]" -ForegroundColor White
    Write-Host "    Port 22" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "檢查 SSH config 檔案..." -ForegroundColor Yellow
$configContent = Get-Content $sshConfigPath -ErrorAction SilentlyContinue
if ($configContent -match "Host\s+$HostName") {
    Write-Host "✓ 找到 $HostName 設定" -ForegroundColor Green
} else {
    Write-Host "✗ 找不到 $HostName 設定" -ForegroundColor Red
    Write-Host "請確認 SSH config 中有正確的 $HostName 設定" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "測試 SSH 連接..." -ForegroundColor Yellow
Write-Host "（這會提示輸入密碼）" -ForegroundColor Gray
Write-Host ""

try {
    $result = ssh -o ConnectTimeout=10 $HostName "echo '連接成功！'; pwd; whoami" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ SSH 連接成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "連接資訊：" -ForegroundColor Cyan
        $result | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
        Write-Host ""
        Write-Host "現在可以執行連接腳本：" -ForegroundColor Green
        Write-Host ".\connect-macincloud.ps1" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "✗ SSH 連接失敗" -ForegroundColor Red
        Write-Host ""
        Write-Host "可能的原因：" -ForegroundColor Yellow
        Write-Host "1. SSH config 設定不正確" -ForegroundColor Gray
        Write-Host "2. MacinCloud 服務未運行" -ForegroundColor Gray
        Write-Host "3. 網路連接問題" -ForegroundColor Gray
        Write-Host "4. 密碼錯誤" -ForegroundColor Gray
        Write-Host ""
        Write-Host "請檢查：" -ForegroundColor Yellow
        Write-Host "- SSH config 檔案內容" -ForegroundColor Gray
        Write-Host "- MacinCloud 服務狀態" -ForegroundColor Gray
    }
} catch {
    Write-Host ""
    Write-Host "✗ 無法執行 SSH 命令" -ForegroundColor Red
    Write-Host "請確認已安裝 OpenSSH 客戶端" -ForegroundColor Yellow
}
