# GitHub Actions 所需的 Secrets

## 1. 取得 Expo Token
```bash
# 在本地執行
eas login
# 登入後執行
eas whoami
# 取得 token
```

## 2. 設定 GitHub Secrets
前往 GitHub 專案設定：
Settings → Secrets and variables → Actions

新增以下 Secrets：
- `EXPO_TOKEN`: 你的 Expo 帳戶 token
- `VERCEL_TOKEN`: Vercel 部署 token (可選)
- `VERCEL_ORG_ID`: Vercel 組織 ID (可選)
- `VERCEL_PROJECT_ID`: Vercel 專案 ID (可選)

## 3. 取得 Vercel Token (可選)
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 取得 token
vercel tokens create
```

## 4. 使用方式
設定完成後，推送程式碼會自動觸發建置：
- Android: 自動建置 APK
- iOS: 需要手動觸發
- 後端: 自動部署到 Vercel
