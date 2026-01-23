# iOS 打包腳本使用說明

## 快速開始

### 1. 複製腳本到雲端 Mac
```bash
# 在雲端 Mac 中
scp ios-build-script.sh user@mac-server:~/
ssh user@mac-server
chmod +x ios-build-script.sh
```

### 2. 基本使用
```bash
# 基本打包 (使用預設參數)
./ios-build-script.sh

# 指定參數
./ios-build-script.sh YourProject.xcodeproj YourScheme ABC123DEF456 ad-hoc

# Workspace 專案
./ios-build-script.sh YourProject.xcworkspace YourScheme ABC123DEF456 app-store
```

## 參數說明

| 參數 | 說明 | 必填 | 範例 |
|------|------|------|------|
| project_path | 專案檔案路徑 | 是 | MyApp.xcodeproj |
| scheme | Scheme 名稱 | 是 | MyApp |
| team_id | 開發者 Team ID | 是 | ABC123DEF456 |
| method | 打包方法 | 是 | ad-hoc |

## 打包方法

### ad-hoc
- 適用於內部測試
- 需要 Ad Hoc Provisioning Profile
- 可安裝在指定設備上

### app-store
- 適用於 App Store 上架
- 需要 App Store Provisioning Profile
- 包含 App Store 所需的符號

### development
- 適用於開發測試
- 需要 Development Provisioning Profile
- 可安裝在開發設備上

### enterprise
- 適用於企業內部分發
- 需要 Enterprise Provisioning Profile
- 可無限制安裝

## 實際使用範例

### 範例 1: Ad Hoc 打包
```bash
./ios-build-script.sh MyApp.xcodeproj MyApp ABC123DEF456 ad-hoc
```

### 範例 2: App Store 打包
```bash
./ios-build-script.sh MyApp.xcworkspace MyApp ABC123DEF456 app-store
```

### 範例 3: 開發版本打包
```bash
./ios-build-script.sh MyApp.xcodeproj MyApp ABC123DEF456 development
```

## 輸出檔案

腳本執行完成後，會在 `./build/` 目錄下生成：

```
build/
├── MyApp_20240123_143022.xcarchive/    # Archive 檔案
├── export/                             # 匯出目錄
│   └── MyApp.ipa                      # IPA 檔案
├── MyApp_20240123_143022.ipa          # 複製的 IPA 檔案
├── ExportOptions.plist                # 匯出設定
└── build_report_20240123_143022.txt   # 建置報告
```

## 常見問題

### 1. 找不到 Scheme
```bash
# 先查看可用的 Schemes
xcodebuild -list -project YourProject.xcodeproj
```

### 2. Team ID 錯誤
```bash
# 查看 Team ID
security find-identity -v -p codesigning
```

### 3. Provisioning Profile 錯誤
```bash
# 查看 Provisioning Profiles
ls ~/Library/MobileDevice/Provisioning\ Profiles/
```

## 自動化建議

### 設定環境變數
```bash
# 在 ~/.bashrc 或 ~/.zshrc 中
export IOS_TEAM_ID="ABC123DEF456"
export IOS_PROJECT_PATH="MyApp.xcodeproj"
export IOS_SCHEME="MyApp"

# 使用環境變數
./ios-build-script.sh $IOS_PROJECT_PATH $IOS_SCHEME $IOS_TEAM_ID ad-hoc
```

### 建立 Alias
```bash
# 在 ~/.bashrc 或 ~/.zshrc 中
alias build-ios='~/ios-build-script.sh MyApp.xcodeproj MyApp ABC123DEF456 ad-hoc'

# 直接使用
build-ios
```

## 整合 CI/CD

### GitHub Actions 範例
```yaml
- name: Build iOS App
  run: |
    chmod +x ios-build-script.sh
    ./ios-build-script.sh MyApp.xcodeproj MyApp ${{ secrets.TEAM_ID }} ad-hoc
```

### Jenkins 範例
```groovy
sh 'chmod +x ios-build-script.sh'
sh './ios-build-script.sh MyApp.xcodeproj MyApp ${TEAM_ID} ad-hoc'
```

## 進階設定

### 自動更新 Provisioning Profile
腳本會自動根據打包方法更新 ExportOptions.plist 中的 provisioningProfiles。

### 自動清理
腳本會自動清理舊的建置檔案和快取。

### 詳細報告
腳本會生成詳細的建置報告，包含所有重要資訊。

## 故障排除

### 檢查日誌
腳本會輸出彩色日誌，幫助快速定位問題。

### 驗證 IPA
腳本會自動驗證 IPA 的簽名和完整性。

### 生成報告
腳本會生成詳細的建置報告，便於問題排查。
