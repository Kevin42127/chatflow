# 設定雲端 Mac 環境的腳本
param(
    [string]$HostName = "macincloud",
    [string]$RemotePath = "~/software2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  設定雲端 Mac 環境" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "此腳本將在雲端 Mac 上安裝必要的工具..." -ForegroundColor Green
Write-Host ""

$setupCommands = @(
    "which node || echo '需要安裝 Node.js'",
    "which npm || echo '需要安裝 npm'",
    "which eas || echo '需要安裝 EAS CLI: npm install -g eas-cli'",
    "cd $RemotePath/mobile && npm install"
)

$command = $setupCommands -join " && "

Write-Host "執行設定指令..." -ForegroundColor Yellow
Write-Host ""

try {
    ssh $HostName $command
    Write-Host ""
    Write-Host "環境檢查完成！" -ForegroundColor Green
    Write-Host ""
    Write-Host "如果看到 '需要安裝' 的訊息，請手動安裝：" -ForegroundColor Yellow
    Write-Host "1. Node.js: 從 https://nodejs.org 下載安裝" -ForegroundColor Gray
    Write-Host "2. EAS CLI: npm install -g eas-cli" -ForegroundColor Gray
    Write-Host "3. 登入 EAS: eas login" -ForegroundColor Gray
} catch {
    Write-Host ""
    Write-Host "錯誤: 無法連接到 $HostName" -ForegroundColor Red
    Write-Host "請確認 SSH 連接設定正確" -ForegroundColor Yellow
}
