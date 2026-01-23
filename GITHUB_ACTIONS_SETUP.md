# GitHub Actions iOS 建置設定指南

## 問題：iOS 憑證未設定

當首次使用 GitHub Actions 建置 iOS 時，可能會遇到以下錯誤：
```
Failed to set up credentials.
You're in non-interactive mode. EAS CLI couldn't find any credentials suitable for internal distribution.
```

## 解決方案

### 方案一：先在本地或雲端 Mac 設定憑證（推薦）

**步驟：**

1. **在本地或雲端 Mac 上執行一次互動式建置**
   ```bash
   cd mobile
   eas build --platform ios --profile preview
   ```
   
2. **按照提示設定憑證**
   - 選擇「Let EAS handle credentials」（讓 EAS 管理憑證）
   - 或提供你的 Apple Developer 帳號資訊

3. **設定完成後，GitHub Actions 就可以使用這些憑證了**

### 方案二：使用 Android 建置（暫時）

如果暫時不需要 iOS 建置，可以先建置 Android：

1. 在 GitHub Actions 中選擇 `android` 平台
2. Android 建置不需要額外的憑證設定

### 方案三：手動設定 Apple Developer 憑證

如果你有 Apple Developer 帳號：

1. **在 GitHub Secrets 中新增以下變數：**
   - `APPLE_ID`: 你的 Apple ID
   - `APPLE_APP_SPECIFIC_PASSWORD`: App-specific password
   - `APPLE_TEAM_ID`: Apple Developer Team ID

2. **更新 workflow 使用這些憑證**

## 檢查憑證狀態

在本地執行以下命令檢查憑證：
```bash
cd mobile
eas credentials
```

## 注意事項

- **首次 iOS 建置必須在互動模式下執行一次**
- 設定完成後，後續建置可以在非互動模式下執行
- EAS 會自動管理憑證，不需要手動上傳

## 快速測試

1. 先在本地或雲端 Mac 執行：
   ```bash
   cd mobile
   eas build --platform ios --profile preview
   ```

2. 設定憑證後，GitHub Actions 就可以正常建置了
