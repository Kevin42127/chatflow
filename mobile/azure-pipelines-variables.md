# Azure Pipelines 變數設定指南

## 必要的 Pipeline Variables

在 Azure DevOps 專案中設定以下變數：

### 🔐 安全變數 (在 Variable Groups 中設定)
```
EXPO_TOKEN=your_expo_token_here
APPLE_ID=your_apple_id@example.com
APPLE_PASSWORD=your_app_specific_password
APPLE_TEAM_ID=ABCD123456
```

### 📋 設定步驟

1. **建立 Variable Group**
   - 前往 Azure DevOps 專案
   - Pipelines → Library → + Variable group
   - 命名為 `mobile-app-secrets`

2. **新增變數**
   - 將所有敏感資訊設為 "Secret"
   - 確保只有授權人員可存取

3. **連結 Pipeline**
   - 在 YAML 中引用 Variable Group
   - 或直接在 Pipeline 中設定

## 🔑 取得必要憑證

### EXPO Token
```bash
eas login
eas project:info
```

### Apple 開發者憑證
1. 註冊 Apple Developer Program ($99/年)
2. 取得 Team ID
3. 產生 App-specific password

## 🚀 觸發建置

### 自動觸發
- 推送到 main/develop 分支
- 建立 Pull Request

### 手動觸發
```bash
# 在 Azure DevOps 中點擊 "Run pipeline"
```

## 📱 建置設定

### Preview Profile (開發測試)
- 內部分發
- 快速建置
- 無需 App Store 審核

### Production Profile (正式上架)
- App Store 發布
- 包含所有最佳化
- 需要完整審核流程

## 🔍 監控與日誌

### 建置日誌位置
- Azure DevOps Pipeline 執行頁面
- 可下載完整日誌檔案

### 常見問題排查
1. 檢查所有變數是否正確設定
2. 確認 Apple Developer 帳戶狀態
3. 驗證 EAS 專案設定
