# 在雲端 Mac 上執行打包的腳本
param(
    [string]$Platform = "all",
    [string]$Profile = "preview",
    [string]$HostName = "macincloud",
    [string]$RemotePath = "~/software2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  雲端 Mac 打包腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$buildCommands = @()

if ($Platform -eq "all" -or $Platform -eq "android") {
    $buildCommands += "cd $RemotePath/mobile && eas build --platform android --profile $Profile"
}

if ($Platform -eq "all" -or $Platform -eq "ios") {
    $buildCommands += "cd $RemotePath/mobile && eas build --platform ios --profile $Profile"
}

if ($buildCommands.Count -eq 0) {
    Write-Host "錯誤: 無效的平台參數。請使用 'android', 'ios' 或 'all'" -ForegroundColor Red
    exit 1
}

Write-Host "準備連接到 $HostName 並執行打包..." -ForegroundColor Green
Write-Host "平台: $Platform" -ForegroundColor Gray
Write-Host "設定檔: $Profile" -ForegroundColor Gray
Write-Host ""

$allCommands = @(
    "cd $RemotePath/mobile",
    "npm install",
    $buildCommands -join " && "
)

$command = $allCommands -join " && "

Write-Host "執行指令：" -ForegroundColor Yellow
Write-Host $command -ForegroundColor Gray
Write-Host ""

try {
    ssh $HostName $command
    Write-Host ""
    Write-Host "打包完成！" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "錯誤: 無法執行遠端指令" -ForegroundColor Red
    Write-Host "請確認：" -ForegroundColor Yellow
    Write-Host "1. SSH 連接正常" -ForegroundColor Gray
    Write-Host "2. 已設定 SSH config 中的 $HostName" -ForegroundColor Gray
    Write-Host "3. 雲端 Mac 上已安裝 Node.js 和 EAS CLI" -ForegroundColor Gray
    Write-Host ""
    Write-Host "手動執行步驟：" -ForegroundColor Yellow
    Write-Host "1. 執行: .\connect-macincloud.ps1" -ForegroundColor Gray
    Write-Host "2. 在 VSCode Remote SSH 中開啟終端機" -ForegroundColor Gray
    Write-Host "3. 執行以下指令：" -ForegroundColor Gray
    Write-Host "   cd ~/software2/mobile" -ForegroundColor White
    foreach ($cmd in $buildCommands) {
        Write-Host "   $cmd" -ForegroundColor White
    }
    exit 1
}
