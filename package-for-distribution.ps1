# ChatFlow 專案打包腳本 - 用於分發
# 排除敏感資訊（API keys、環境變數等）

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ChatFlow 專案打包腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
if (-not $projectRoot) {
    $projectRoot = Get-Location
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$zipFileName = "ChatFlow_Source_$timestamp.zip"
$tempDir = Join-Path $env:TEMP "ChatFlow_Package_$timestamp"

Write-Host "專案根目錄: $projectRoot" -ForegroundColor Gray
Write-Host "輸出檔案: $zipFileName" -ForegroundColor Gray
Write-Host ""

# 創建臨時目錄
Write-Host "創建臨時目錄..." -ForegroundColor Yellow
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# 要複製的目錄和檔案（白名單方式）
$itemsToCopy = @(
    "backend",
    "mobile",
    ".github",
    "download.html",
    "download.css",
    "download.js",
    "README.md",
    "vercel.json",
    ".gitignore"
)

Write-Host "複製檔案（排除敏感資訊）..." -ForegroundColor Yellow

foreach ($item in $itemsToCopy) {
    $sourcePath = Join-Path $projectRoot $item
    $destPath = Join-Path $tempDir $item
    
    if (Test-Path $sourcePath) {
        if (Test-Path $sourcePath -PathType Container) {
            # 複製目錄，但排除特定內容
            Write-Host "  複製目錄: $item" -ForegroundColor Gray
            
            # 使用 robocopy 複製，排除不需要的檔案
            $excludeDirs = @("node_modules", ".git", ".expo", ".expo-shared", "dist", "build", "web-build", ".cache", "coverage")
            $excludeFiles = @("*.log", "*.tmp", ".DS_Store", "Thumbs.db", ".env", "package-lock.json", "*.pid", "*.seed")
            
            # 構建 robocopy 命令
            $robocopyCmd = "robocopy `"$sourcePath`" `"$destPath`" /E /NFL /NDL /NJH /NJS"
            
            foreach ($dir in $excludeDirs) {
                $robocopyCmd += " /XD `"$dir`""
            }
            
            foreach ($file in $excludeFiles) {
                $robocopyCmd += " /XF `"$file`""
            }
            
            # 執行 robocopy
            $robocopyResult = Invoke-Expression $robocopyCmd 2>&1
            $exitCode = $LASTEXITCODE
            
            # robocopy 返回 0-7 都是成功
            if ($exitCode -le 7) {
                Write-Host "    ✓ 完成" -ForegroundColor Green
            } else {
                Write-Host "    ⚠ 警告: 部分檔案可能未複製 (退出碼: $exitCode)" -ForegroundColor Yellow
            }
        } else {
            # 複製單個檔案
            Write-Host "  複製檔案: $item" -ForegroundColor Gray
            Copy-Item $sourcePath -Destination $destPath -Force
            Write-Host "    ✓ 完成" -ForegroundColor Green
        }
    }
}

# 在 backend 目錄中，確保只保留 env.example，刪除 .env
$backendEnvPath = Join-Path $tempDir "backend\.env"
if (Test-Path $backendEnvPath) {
    Write-Host "  移除敏感檔案: backend\.env" -ForegroundColor Yellow
    Remove-Item $backendEnvPath -Force
}

# 在 mobile 目錄中，移除 package-lock.json（如果存在）
$mobileLockPath = Join-Path $tempDir "mobile\package-lock.json"
if (Test-Path $mobileLockPath) {
    Write-Host "  移除: mobile\package-lock.json" -ForegroundColor Gray
    Remove-Item $mobileLockPath -Force
}

$backendLockPath = Join-Path $tempDir "backend\package-lock.json"
if (Test-Path $backendLockPath) {
    Write-Host "  移除: backend\package-lock.json" -ForegroundColor Gray
    Remove-Item $backendLockPath -Force
}

# 創建 README 說明檔案
$readmeContent = @"
# ChatFlow 專案分發版本

## 安裝說明

### 後端設置

1. 進入 backend 目錄：
   ```bash
   cd backend
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 複製環境變數範例檔案：
   ```bash
   cp env.example .env
   ```

4. 編輯 .env 檔案，填入你的 Groq API Key：
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

5. 啟動後端伺服器：
   ```bash
   npm start
   ```

### 前端設置

1. 進入 mobile 目錄：
   ```bash
   cd mobile
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 更新 API 端點：
   - 編輯 `mobile/utils/constants.js`
   - 更新 `API_BASE_URL` 為你的後端地址

4. 啟動開發伺服器：
   ```bash
   npm start
   ```

## 重要提醒

- 此分發版本不包含 API keys 和敏感資訊
- 需要自行設置後端環境變數
- 需要自行配置 API 端點
- 打包時間: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

$readmePath = Join-Path $tempDir "INSTALL.md"
$readmeContent | Out-File -FilePath $readmePath -Encoding UTF8
Write-Host "  創建說明檔案: INSTALL.md" -ForegroundColor Green

Write-Host ""
Write-Host "創建 ZIP 檔案..." -ForegroundColor Yellow

# 創建 ZIP 檔案
$zipPath = Join-Path $projectRoot $zipFileName
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipPath)
    Write-Host "  ✓ ZIP 檔案創建成功" -ForegroundColor Green
} catch {
    Write-Host "  ✗ 創建 ZIP 失敗，嘗試使用 Compress-Archive..." -ForegroundColor Yellow
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
}

# 清理臨時目錄
Write-Host "清理臨時檔案..." -ForegroundColor Yellow
Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue

$fileSize = (Get-Item $zipPath).Length / 1MB

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  打包完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "檔案名稱: $zipFileName" -ForegroundColor Cyan
Write-Host "檔案大小: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
Write-Host "檔案位置: $zipPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "已排除的內容:" -ForegroundColor Yellow
Write-Host "  - node_modules（依賴套件）" -ForegroundColor Gray
Write-Host "  - .env 檔案（API keys）" -ForegroundColor Gray
Write-Host "  - .git 目錄（版本控制）" -ForegroundColor Gray
Write-Host "  - package-lock.json（鎖定檔案）" -ForegroundColor Gray
Write-Host "  - 建置輸出檔案" -ForegroundColor Gray
Write-Host "  - 其他敏感資訊" -ForegroundColor Gray
Write-Host ""
