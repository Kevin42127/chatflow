# 自動啟動 VSCode Remote SSH
Write-Host "正在啟動 VSCode Remote SSH 連接..."
Write-Host ""

# 啟動 VSCode Remote SSH
Start-Process "code" -ArgumentList "--remote=ssh-remote+macincloud"

Write-Host "VSCode 已啟動，請："
Write-Host "1. 等待連接視窗出現"
Write-Host "2. 按 Win+空白鍵 切換到英文輸入法"
Write-Host "3. 輸入你的 MacinCloud 密碼"
Write-Host ""
Write-Host "如果連接失敗，請在 VSCode 中手動執行："
Write-Host "- 按 Ctrl+Shift+P"
Write-Host "- 輸入: Remote-SSH: Connect to Host"
Write-Host "- 選擇: macincloud"
