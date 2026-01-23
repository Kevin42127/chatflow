# ChatFlow 下載頁面

現代化的應用程式下載頁面，提供 Android APK 下載功能。

## 功能特色

- 響應式設計，支援各種裝置
- 現代化 UI 設計，使用漸層背景和動畫效果
- 自動從 Expo API 取得最新建置資訊
- 一鍵下載 Android APK
- 使用 Google Material Icons

## 檔案結構

```
download/
├── index.html      # 主頁面
├── styles.css      # 樣式檔案
├── script.js       # JavaScript 功能
└── README.md       # 說明文件
```

## 使用方式

### 本地測試

1. 使用本地伺服器開啟：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve
   ```

2. 在瀏覽器中開啟：`http://localhost:8000/download`

### 部署到 Vercel

頁面已配置在 `vercel.json` 中，推送到 GitHub 後會自動部署。

訪問網址：`https://chatflowk-kevin.vercel.app/download`

## 自訂設定

### 修改 Expo Project ID

在 `script.js` 中修改：
```javascript
const EXPO_PROJECT_ID = '你的專案ID';
```

### 修改應用程式資訊

在 `index.html` 中修改應用程式名稱、版本號等資訊。

## 注意事項

- 確保 `mobile/assets/android/play_store_512.png` 檔案存在
- iOS 下載功能需要先完成 iOS 建置設定
- 下載連結會自動從 Expo API 取得最新的建置
