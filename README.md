# ChatFlow

跨平台行動應用程式，整合 Groq AI 提供智能對話功能。

## 技術棧

- **前端**: React Native + Expo (Expo Go)
- **後端**: Node.js + Express
- **AI 服務**: Groq AI API
- **狀態管理**: React Context API
- **本地儲存**: AsyncStorage

## 專案結構

```
software2/
├── mobile/                    # Expo 行動應用程式
│   ├── App.js
│   ├── app.json
│   ├── components/
│   │   ├── ChatScreen.js
│   │   ├── MessageBubble.js
│   │   ├── ChatInput.js
└── README.md
```

## 功能特色

- **AI 對話** - 使用 Groq API 提供智能回應
- **多語言支援** - 自動偵測並支援中文/英文
- **跨平台** - iOS/Android/Web 支援
- **主題切換** - 明暗模式支援
- **使用限制** - 每日使用次數管理

## 部署

### 後端部署 (Vercel)
```bash
# 推送到 GitHub 後自動部署到 Vercel
git push origin main
```

### 手機應用打包
```bash
# Android APK
npm run build:android

# iOS (需要 Mac)
npm run build:ios
```

## 環境變數

### 後端 (.env)
```
GROQ_API_KEY=your_groq_api_key
NODE_ENV=production
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
NODE_ENV=development
```

5. 啟動後端伺服器：
```bash
npm start
```

### 前端設定

1. 進入行動應用程式目錄：
```bash
cd mobile
```

2. 安裝依賴：
```bash
npm install
```

3. 更新 `mobile/utils/constants.js` 中的 `API_BASE_URL`：
   - 開發環境：使用你的電腦 IP 地址（例如：`http://192.168.1.100:3000`）
   - 確保手機和電腦在同一網路

4. 啟動 Expo 開發伺服器：
```bash
npm start
```

5. 使用 Expo Go 掃描 QR Code 開啟應用程式

## 功能特色

- 現代化 UI 設計（漸層背景、流暢動畫）
- 跨平台支援（iOS & Android）
- 符合平台設計規範（Material Design & HIG）
- 聊天歷史記錄本地儲存
- 即時 AI 對話
- 無啟動畫面，快速啟動

## 開發注意事項

- 確保後端伺服器運行在正確的端口
- 開發時使用電腦的區域網路 IP 地址
- Groq API Key 必須設定在後端 `.env` 檔案中
- 應用程式已移除啟動畫面，直接進入主畫面

## 授權

版權所有 © Groq AI Chat
