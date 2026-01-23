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

### CI/CD 自動打包 (Azure DevOps)

#### 快速開始

**1. 取得 Expo Access Token**
- 前往 [Expo 帳號設定](https://expo.dev/accounts/[你的帳號]/settings/access-tokens)
- 建立新的 Token 並複製

**2. 在 Azure DevOps 設定**

**方式一：使用 Pipeline 變數（推薦，更簡單）**

1. 登入 [dev.azure.com](https://dev.azure.com)
2. 建立新專案或選擇現有專案
3. 連接 GitHub Repository：`https://github.com/Kevin42127/chatflow`
4. 建立 Pipeline：
   - 前往「Pipelines」→「Pipelines」→「Create Pipeline」
   - 選擇「Existing Azure Pipelines YAML file」
   - 選擇分支 `master` 和檔案 `azure-pipelines-no-vargroup.yml`
5. 設定 Pipeline 變數：
   - 在 Pipeline 編輯頁面，點擊右上角「...」→「Variables」
   - 點擊「+」新增變數：
     - 名稱：`EXPO_TOKEN`
     - 值：貼上你的 Expo Token
     - **勾選「Keep this value secret」**
   - 點擊「Save」

**方式二：使用變數群組**

1. 登入 [dev.azure.com](https://dev.azure.com)
2. 建立新專案或選擇現有專案
3. 連接 GitHub Repository：`https://github.com/Kevin42127/chatflow`
4. 建立變數群組：
   - 前往「Pipelines」→「Library」
   - 建立變數群組 `expo-variables`
   - 新增變數 `EXPO_TOKEN`（勾選「Keep this value secret」）
5. 建立 Pipeline：
   - 前往「Pipelines」→「Pipelines」→「Create Pipeline」
   - 選擇「Existing Azure Pipelines YAML file」
   - 選擇分支 `master` 和檔案 `azure-pipelines.yml`
   - **重要**：在 Pipeline 設定中授權使用 `expo-variables` 變數群組：
     - 點擊右上角「...」→「Security」
     - 找到「Variable groups」區塊
     - 點擊「+」新增 `expo-variables` 群組
     - 確認已勾選並點擊「Save」

**3. 執行建置**

- 點擊「Run pipeline」手動執行
- 或推送程式碼到 `master` 分支自動觸發
- 選擇平台：`ios`、`android` 或 `all`
- 選擇設定檔：`preview`、`production` 或 `development`

#### 詳細設定指南

完整的設定步驟請參考：[AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md)

#### 建置參數

- **平台**: `all` / `android` / `ios`
- **設定檔**: `preview` / `production` / `development`

#### 注意事項

- 需要 Mac 代理（`macos-latest`）進行 iOS 打包
- 確保 `EXPO_TOKEN` 已正確設定並設為 Secret
- 建置會自動等待完成（`--wait` 參數）
- 建置結果可在 Expo 網站查看

### 手機應用打包（雲端 Mac）

#### 前置需求

**本地環境（Windows）**
- VSCode 已安裝 Remote-SSH 擴充功能
- SSH 設定檔已配置（`~/.ssh/config`）

**雲端 Mac 環境**
- Node.js 已安裝
- EAS CLI 已安裝：`npm install -g eas-cli`
- 已登入 EAS：`eas login`

#### SSH 設定

在 `~/.ssh/config` 中加入：
```
Host macincloud
    HostName [你的 MacinCloud IP 或主機名]
    User [你的 MacinCloud 用戶名]
    Port 22
```

#### 連接方式

**方式一：使用 VSCode Remote SSH（推薦）**
```powershell
.\connect-macincloud.ps1
```

**方式二：使用 PowerShell 腳本直接打包**
```powershell
# Android 打包
.\build-on-mac.ps1 -Platform android

# iOS 打包
.\build-on-mac.ps1 -Platform ios

# 同時打包
.\build-on-mac.ps1 -Platform all
```

#### 在雲端 Mac 上執行打包

連接後，在終端機中執行：
```bash
cd ~/software2/mobile

# Android APK
npm run build:android

# iOS
npm run build:ios

# 同時打包
npm run build:all
```

#### 首次設定

執行環境設定腳本：
```powershell
.\setup-remote-mac.ps1
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
