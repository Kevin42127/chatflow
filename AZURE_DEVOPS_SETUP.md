# Azure DevOps iOS 建置設定指南

## 前置準備

### 1. 取得 Expo Access Token

1. 前往 [Expo 帳號設定](https://expo.dev/accounts/[你的帳號]/settings/access-tokens)
2. 點擊「Create Token」
3. 輸入名稱（例如：`azure-devops-ci`）
4. 複製產生的 Token（只會顯示一次，請妥善保存）

### 2. 準備 Azure DevOps 帳號

- 如果還沒有帳號，前往 [Azure DevOps](https://dev.azure.com) 註冊
- 建立或選擇一個組織（Organization）

## 設定步驟

### 步驟 1：建立專案

1. 登入 [Azure DevOps](https://dev.azure.com)
2. 點擊「New project」
3. 填寫專案資訊：
   - **專案名稱**：`chatflow`（或你喜歡的名稱）
   - **可見性**：Private 或 Public
   - **版本控制**：Git
4. 點擊「Create」

### 步驟 2：連接 GitHub Repository

1. 在專案中，點擊左側選單「Repos」
2. 點擊「Import repository」
3. 輸入你的 GitHub repository URL：`https://github.com/Kevin42127/chatflow`
4. 點擊「Import」

或者，如果你已經有本地 Git，可以：
```bash
git remote add azure https://dev.azure.com/[你的組織]/[專案名稱]/_git/[專案名稱]
git push azure master
```

### 步驟 3：建立變數群組

1. 在專案中，點擊左側選單「Pipelines」→「Library」
2. 點擊「+ Variable group」
3. 設定：
   - **名稱**：`expo-variables`
   - **描述**：Expo EAS Build 相關變數
4. 點擊「+ Add」新增變數：
   - **名稱**：`EXPO_TOKEN`
   - **值**：貼上你從 Expo 取得的 Access Token
   - **勾選「Keep this value secret」**（重要！）
5. 點擊「Save」

### 步驟 4：建立 Pipeline

#### 方式一：使用現有的 YAML 檔案（推薦）

1. 在專案中，點擊左側選單「Pipelines」→「Pipelines」
2. 點擊「Create Pipeline」
3. 選擇「GitHub」或「Azure Repos Git」（根據你的儲存庫位置）
4. 選擇你的 repository：`Kevin42127/chatflow`
5. 選擇「Existing Azure Pipelines YAML file」
6. 選擇分支：`master`
7. 選擇檔案路徑：`azure-pipelines.yml`
8. 點擊「Continue」

#### 方式二：使用 Starter Pipeline 並貼上內容

1. 在專案中，點擊左側選單「Pipelines」→「Pipelines」
2. 點擊「Create Pipeline」
3. 選擇「GitHub」或「Azure Repos Git」
4. 選擇你的 repository
5. 選擇「Starter pipeline」
6. 在編輯器中，**刪除所有預設內容**
7. 複製 `azure-pipelines.yml` 的內容並貼上
8. 點擊「Save」

### 步驟 5：授權變數群組（重要！）

**如果使用變數群組，必須完成此步驟：**

1. 在 Pipeline 編輯頁面，點擊右上角「...」→「Security」
2. 找到「Variable groups」區塊
3. 點擊「+」新增 `expo-variables` 群組
4. 確認已勾選
5. 點擊「Save」

**如果遇到「Variable group was not found or is not authorized」錯誤：**
- 確認變數群組名稱正確（`expo-variables`）
- 確認已完成授權步驟
- 或使用替代方案：在 Pipeline 中直接設定變數（見下方）

### 步驟 6：設定 Pipeline 權限

1. 在 Pipeline 頁面，點擊右上角「...」→「Manage security」
2. 確認你的帳號有「Queue builds」權限
3. 如果需要，點擊「+」新增使用者或群組

## 執行建置

### 手動執行建置

1. 在 Pipeline 頁面，點擊「Run pipeline」
2. 選擇分支：`master`
3. 設定參數（如果使用進階版本）：
   - **建置平台**：選擇 `ios`、`android` 或 `all`
   - **建置設定檔**：選擇 `preview`、`production` 或 `development`
4. 點擊「Run」

### 自動觸發建置

當你推送程式碼到 `master` 分支時，Pipeline 會自動執行。

## 查看建置結果

1. 在 Pipeline 頁面，點擊執行中的建置
2. 查看各步驟的執行狀態
3. 點擊「Artifacts」查看建置產物
4. 建置完成後，可以在 Expo 網站查看建置狀態

## 替代方案：不使用變數群組

如果不想使用變數群組，可以使用 `azure-pipelines-no-vargroup.yml`：

1. 在 Pipeline 編輯頁面，點擊右上角「...」→「Variables」
2. 點擊「+」新增變數：
   - **名稱**：`EXPO_TOKEN`
   - **值**：貼上你的 Expo Token
   - **勾選「Keep this value secret」**
3. 點擊「Save」
4. 將 Pipeline YAML 檔案改為使用 `azure-pipelines-no-vargroup.yml`

## 常見問題

### 問題 1：錯誤「Variable group was not found or is not authorized」

**解決方法：**

**選項 A：授權變數群組**
1. 在 Pipeline 頁面，點擊右上角「...」→「Security」
2. 找到「Variable groups」區塊
3. 點擊「+」新增 `expo-variables` 群組
4. 確認已勾選並點擊「Save」

**選項 B：使用 Pipeline 變數（推薦，更簡單）**
1. 在 Pipeline 編輯頁面，點擊右上角「...」→「Variables」
2. 新增變數 `EXPO_TOKEN`（設為 Secret）
3. 使用 `azure-pipelines-no-vargroup.yml` 檔案

### 問題 2：建置失敗，顯示「EXPO_TOKEN not found」

**解決方法：**
- 確認變數群組 `expo-variables` 已建立
- 確認 Pipeline 已授權使用該變數群組
- 檢查變數名稱是否為 `EXPO_TOKEN`（大小寫需一致）

### 問題 2：建置失敗，顯示「EAS login failed」

**解決方法：**
- 確認 `EXPO_TOKEN` 是有效的
- 確認 Token 沒有過期
- 重新產生 Token 並更新變數群組

### 問題 3：iOS 建置需要 Mac 代理

**說明：**
- 配置中已使用 `macos-latest`，這是正確的
- 如果組織沒有 Mac 代理，需要：
  1. 購買 Azure DevOps 的 Mac 代理授權
  2. 或使用 Microsoft-hosted Mac 代理（可能有使用限制）

### 問題 4：建置時間過長

**優化建議：**
- 使用快取來加速依賴安裝
- 考慮只建置特定平台（不要同時建置 iOS 和 Android）
- 使用 `--no-wait` 參數讓建置在背景執行（但會失去即時狀態）

## 進階設定

### 只建置 iOS

修改 `azure-pipelines.yml`，將參數預設值改為：
```yaml
parameters:
  - name: platform
    default: 'ios'  # 改為只建置 iOS
```

### 使用 Production 設定檔

修改參數預設值：
```yaml
parameters:
  - name: profile
    default: 'production'  # 改為 production
```

### 添加建置通知

在 Pipeline 中加入通知步驟，當建置完成時發送通知到 Teams、Slack 或 Email。

## 相關資源

- [Azure Pipelines 文件](https://docs.microsoft.com/azure/devops/pipelines/)
- [Expo EAS Build 文件](https://docs.expo.dev/build/introduction/)
- [Azure DevOps 定價](https://azure.microsoft.com/pricing/details/devops/azure-devops-services/)
