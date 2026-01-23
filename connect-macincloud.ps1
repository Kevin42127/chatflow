# VSCode Remote SSH 連接腳本
param(
    [string]$HostName = "macincloud",
    [string]$RemotePath = "~/software2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  連接到 MacinCloud 雲端 Mac" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$sshConfigPath = "$env:USERPROFILE\.ssh\config"
$sshConfigExists = Test-Path $sshConfigPath

if (-not $sshConfigExists) {
    Write-Host "警告: 找不到 SSH 設定檔 ($sshConfigPath)" -ForegroundColor Yellow
    Write-Host "請先設定 SSH config 檔案" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "建立 SSH config 步驟：" -ForegroundColor Yellow
    Write-Host "1. 建立資料夾: mkdir $env:USERPROFILE\.ssh" -ForegroundColor Gray
    Write-Host "2. 建立 config 檔案並加入以下內容：" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Host macincloud" -ForegroundColor White
    Write-Host "    HostName [你的 MacinCloud IP 或主機名]" -ForegroundColor White
    Write-Host "    User [你的 MacinCloud 用戶名]" -ForegroundColor White
    Write-Host "    Port 22" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "正在測試 SSH 連接..." -ForegroundColor Yellow
$testConnection = ssh -o ConnectTimeout=5 -o BatchMode=yes $HostName "echo 'SSH連接成功'" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "SSH 連接測試失敗，但這可能是正常的（需要密碼認證）" -ForegroundColor Yellow
    Write-Host "繼續嘗試連接..." -ForegroundColor Gray
    Write-Host ""
}

Write-Host "正在啟動 VSCode Remote SSH..." -ForegroundColor Green
Write-Host ""
Write-Host "連接方式：" -ForegroundColor Yellow
Write-Host "方式一：先連接，再打開工作區（推薦）" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "步驟 1: 啟動 VSCode 並連接到 $HostName..." -ForegroundColor Green
    Start-Process "code" -ArgumentList "--remote=ssh-remote+$HostName"
    
    Start-Sleep -Seconds 2
    
    Write-Host "步驟 2: 打開遠端工作區..." -ForegroundColor Green
    Start-Sleep -Seconds 3
    Start-Process "code" -ArgumentList "--remote=ssh-remote+$HostName", $RemotePath
    
    Write-Host ""
    Write-Host "VSCode 已啟動！" -ForegroundColor Green
    Write-Host ""
    Write-Host "如果看到空白視窗，請：" -ForegroundColor Yellow
    Write-Host "1. 等待幾秒讓連接建立" -ForegroundColor Gray
    Write-Host "2. 檢查 VSCode 右下角是否顯示 'SSH: $HostName'" -ForegroundColor Gray
    Write-Host "3. 如果提示輸入密碼：" -ForegroundColor Gray
    Write-Host "   - 按 Win+空白鍵 切換到英文輸入法" -ForegroundColor Gray
    Write-Host "   - 確認右下角顯示 ENG" -ForegroundColor Gray
    Write-Host "   - 輸入你的 MacinCloud 密碼" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. 連接成功後，按 Ctrl+Shift+P，輸入 'Open Folder' 選擇工作區：" -ForegroundColor Gray
    Write-Host "   $RemotePath" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "錯誤: 無法啟動 VSCode" -ForegroundColor Red
    Write-Host "請確認已安裝 VSCode 並已安裝 Remote-SSH 擴充功能" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "手動連接步驟：" -ForegroundColor Yellow
    Write-Host "1. 開啟 VSCode" -ForegroundColor Gray
    Write-Host "2. 按 Ctrl+Shift+P 開啟指令面板" -ForegroundColor Gray
    Write-Host "3. 輸入: Remote-SSH: Connect to Host" -ForegroundColor Gray
    Write-Host "4. 選擇: $HostName" -ForegroundColor Gray
    Write-Host "5. 連接成功後，按 Ctrl+Shift+P，輸入 'Remote-SSH: Open Folder in Remote'" -ForegroundColor Gray
    Write-Host "6. 選擇: $RemotePath" -ForegroundColor Gray
}
