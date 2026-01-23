# 修復 Pipeline 變數群組錯誤

## 問題
錯誤訊息：`Variable group was not found or is not authorized for use`

## 解決方案：切換到不使用變數群組的版本

### 步驟 1：確認 Pipeline 變數已設定
1. 在 Azure DevOps Pipeline 頁面
2. 點擊右上角「...」→「Variables」
3. 確認已新增變數 `EXPO_TOKEN`（設為 Secret）
4. 如果沒有，請新增：
   - 名稱：`EXPO_TOKEN`
   - 值：你的 Expo Token
   - 勾選「Keep this value secret」

### 步驟 2：切換 YAML 檔案
1. 在 Pipeline 頁面，點擊「Edit」
2. 點擊右上角「...」→「Settings」或直接編輯 YAML
3. 找到檔案路徑設定，改為：`azure-pipelines-no-vargroup.yml`
4. 或者直接編輯 YAML，將以下內容：
   ```yaml
   variables:
     - group: 'expo-variables'
   ```
   改為：
   ```yaml
   variables:
     - name: nodeVersion
       value: '18.x'
     - name: workingDirectory
       value: 'mobile'
   ```
5. 點擊「Save」

### 步驟 3：驗證
1. 點擊「Run pipeline」測試
2. 應該不會再出現變數群組錯誤

## 替代方案：正確授權變數群組

如果你想繼續使用變數群組：

1. 在 Pipeline 頁面，點擊右上角「...」→「Security」
2. 找到「Variable groups」區塊
3. 點擊「+」新增變數群組
4. 選擇 `expo-variables` 群組
5. 確認已勾選
6. 點擊「Save」

## 快速修復（推薦）

**最簡單的方法：**
1. 刪除現有 Pipeline
2. 建立新 Pipeline
3. 選擇「Existing Azure Pipelines YAML file」
4. 選擇 `azure-pipelines-no-vargroup.yml`
5. 在 Pipeline 設定中新增變數 `EXPO_TOKEN`

這樣就不需要變數群組了！
