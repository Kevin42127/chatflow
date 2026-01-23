# Azure DevOps 設定指南

## 🚀 快速設定步驟

### 1. 建立 Azure DevOps 專案
1. 前往 [Azure DevOps](https://dev.azure.com)
2. 建立新專案或使用現有專案
3. 選擇 Git 版本控制

### 2. 連接程式碼倉庫
```bash
# 如果使用 GitHub，安裝 Azure Pipelines 擴充功能
# 在 Azure DevOps 中：Project Settings → GitHub connections
```

### 3. 建立 Pipeline
1. 在專案中點擊 "Pipelines"
2. 選擇 "New pipeline"
3. 選擇 "Existing Azure Pipelines YAML file"
4. 選擇 `azure-pipelines.yml`

### 4. 設定 Variable Group
1. 前往 "Pipelines" → "Library"
2. 點擊 "+ Variable group"
3. 命名為 `mobile-app-secrets`
4. 新增以下變數（全部設為 Secret）：

```
EXPO_TOKEN
APPLE_ID
APPLE_PASSWORD  
APPLE_TEAM_ID
```

## 🔑 取得憑證

### EXPO Token
```bash
eas login
eas project:info
# 複製 Project ID 和 Token
```

### Apple Developer 資訊
1. 登入 [Apple Developer](https://developer.apple.com)
2. 前往 "Membership" 頁面
3. 複製 Team ID
4. 產生 App-specific password

## 📱 Pipeline 功能

### 自動觸發
- 推送到 `main` 或 `develop` 分支
- 建立 Pull Request

### 建置環境
- macOS 最新版本
- Node.js 18.x
- Expo CLI 和 EAS CLI

### 建置類型
- **Preview**: 開發測試版本
- **Production**: 正式上架版本

## 🔍 監控與除錯

### 查看建置狀態
- Azure DevOps → Pipelines → Builds
- 點擊特定建置查看詳細資訊

### 常見問題
1. **憑證錯誤**: 檢查 Variable Group 設定
2. **Apple 帳戶**: 確認 Developer Program 狀態
3. **EAS 專案**: 驗證專案連線

## 💰 成本估算

### Azure Pipelines 定價
- **免費额度**: 每月 1,800 分鐘
- **macOS**: 消耗 2 倍分鐘數
- **預估**: 每次建置約 20-30 分鐘

### 節省成本技巧
- 只在必要時觸發建置
- 使用 PR 觸發進行測試
- 定期清理舊的建置記錄
