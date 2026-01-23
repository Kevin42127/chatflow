#!/bin/bash
# iOS 應用自動打包腳本
# 使用方法: ./ios-build-script.sh [project_path] [scheme] [team_id] [method]

# 預設參數
PROJECT_PATH="${1:-YourProject.xcodeproj}"
SCHEME="${2:-YourScheme}"
TEAM_ID="${3:-YOUR_TEAM_ID}"
METHOD="${4:-ad-hoc}"
CONFIGURATION="Release"
BUILD_DIR="./build"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日誌函數
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查必要工具
check_requirements() {
    log_info "檢查系統要求..."
    
    # 檢查 Xcode
    if ! command -v xcodebuild &> /dev/null; then
        log_error "Xcode 未安裝或不在 PATH 中"
        exit 1
    fi
    
    # 檢查專案檔案
    if [ ! -f "$PROJECT_PATH" ]; then
        log_error "找不到專案檔案: $PROJECT_PATH"
        exit 1
    fi
    
    # 檢查是否為 workspace
    if [[ "$PROJECT_PATH" == *.xcworkspace ]]; then
        PROJECT_TYPE="-workspace"
    else
        PROJECT_TYPE="-project"
    fi
    
    log_info "Xcode 版本: $(xcodebuild -version | head -1)"
    log_info "專案類型: $PROJECT_TYPE"
}

# 列出可用的 schemes 和 targets
list_project_info() {
    log_info "專案資訊:"
    xcodebuild $PROJECT_TYPE "$PROJECT_PATH" -list
    echo ""
}

# 檢查開發者身份
check_developer_identity() {
    log_info "檢查開發者身份..."
    
    # 檢查簽名身份
    if ! security find-identity -v -p codesigning | grep -q "$TEAM_ID"; then
        log_warn "找不到 Team ID: $TEAM_ID"
        log_info "可用的簽名身份:"
        security find-identity -v -p codesigning
        echo ""
    fi
}

# 清理建置目錄
clean_project() {
    log_info "清理專案..."
    
    # 清理 Xcode 快取
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    
    # 清理專案
    xcodebuild $PROJECT_TYPE "$PROJECT_PATH" -scheme "$SCHEME" -configuration "$CONFIGURATION" clean
    
    # 建立建置目錄
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    
    log_info "清理完成"
}

# 建立 Archive
build_archive() {
    log_info "建立 Archive..."
    
    ARCHIVE_PATH="$BUILD_DIR/${SCHEME}_${TIMESTAMP}.xcarchive"
    
    log_info "Archive 路徑: $ARCHIVE_PATH"
    
    # 執行 Archive
    if xcodebuild $PROJECT_TYPE "$PROJECT_PATH" -scheme "$SCHEME" -configuration "$CONFIGURATION" archive -archivePath "$ARCHIVE_PATH"; then
        log_info "✅ Archive 建立成功"
        return 0
    else
        log_error "❌ Archive 建立失敗"
        return 1
    fi
}

# 建立 ExportOptions.plist
create_export_options() {
    log_info "建立 ExportOptions.plist..."
    
    cat > "$BUILD_DIR/ExportOptions.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>${METHOD}</string>
    <key>teamID</key>
    <string>${TEAM_ID}</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
EOF

    # 根據不同方法添加額外設定
    case "$METHOD" in
        "ad-hoc")
            echo "    <key>provisioningProfiles</key>
    <dict>
        <key>com.yourcompany.yourapp</key>
        <string>Your Ad Hoc Profile Name</string>
    </dict>" >> "$BUILD_DIR/ExportOptions.plist"
            ;;
        "development")
            echo "    <key>provisioningProfiles</key>
    <dict>
        <key>com.yourcompany.yourapp</key>
        <string>Your Development Profile Name</string>
    </dict>" >> "$BUILD_DIR/ExportOptions.plist"
            ;;
    esac
    
    echo "</dict>
</plist>" >> "$BUILD_DIR/ExportOptions.plist"
    
    log_info "ExportOptions.plist 建立完成"
}

# 匯出 IPA
export_ipa() {
    log_info "匯出 IPA..."
    
    EXPORT_PATH="$BUILD_DIR/export"
    
    if xcodebuild -exportArchive -archivePath "$ARCHIVE_PATH" -exportPath "$EXPORT_PATH" -exportOptionsPlist "$BUILD_DIR/ExportOptions.plist"; then
        log_info "✅ IPA 匯出成功"
        
        # 查找 IPA 檔案
        IPA_FILE=$(find "$EXPORT_PATH" -name "*.ipa" | head -1)
        
        if [ -n "$IPA_FILE" ]; then
            log_info "IPA 檔案: $IPA_FILE"
            log_info "檔案大小: $(du -h "$IPA_FILE" | cut -f1)"
            
            # 複製到建置目錄根目錄
            cp "$IPA_FILE" "$BUILD_DIR/${SCHEME}_${TIMESTAMP}.ipa"
            log_info "IPA 已複製到: $BUILD_DIR/${SCHEME}_${TIMESTAMP}.ipa"
        fi
        
        return 0
    else
        log_error "❌ IPA 匯出失敗"
        return 1
    fi
}

# 驗證 IPA
validate_ipa() {
    log_info "驗證 IPA..."
    
    IPA_FILE=$(find "$BUILD_DIR" -name "*.ipa" | head -1)
    
    if [ -n "$IPA_FILE" ]; then
        # 檢查簽名
        log_info "檢查簽名..."
        codesign -dv --verbose=4 "$IPA_FILE" 2>&1 | head -5
        
        # 驗證 App
        log_info "驗證 App..."
        if spctl -a -v "$IPA_FILE" 2>&1 | grep -q "accepted"; then
            log_info "✅ IPA 驗證通過"
        else
            log_warn "⚠️ IPA 驗證失敗，但檔案仍可使用"
        fi
        
        # 顯示 IPA 內容
        log_info "IPA 內容:"
        unzip -l "$IPA_FILE" | head -10
    fi
}

# 生成報告
generate_report() {
    log_info "生成建置報告..."
    
    REPORT_FILE="$BUILD_DIR/build_report_${TIMESTAMP}.txt"
    
    cat > "$REPORT_FILE" << EOF
iOS 建置報告
================
建置時間: $(date)
專案: $PROJECT_PATH
Scheme: $SCHEME
Team ID: $TEAM_ID
方法: $METHOD
配置: $CONFIGURATION

建置結果:
- Archive: $ARCHIVE_PATH
- IPA: $(find "$BUILD_DIR" -name "*.ipa" | head -1)

系統資訊:
- Xcode: $(xcodebuild -version | head -1)
- macOS: $(sw_vers | grep "ProductVersion" | cut -d: -f2 | tr -d ' ')

檔案大小:
$(du -h "$BUILD_DIR"/*.ipa 2>/dev/null || echo "無 IPA 檔案")
EOF

    log_info "報告已生成: $REPORT_FILE"
}

# 主函數
main() {
    log_info "🚀 開始 iOS 應用打包..."
    log_info "專案: $PROJECT_PATH"
    log_info "Scheme: $SCHEME"
    log_info "Team ID: $TEAM_ID"
    log_info "方法: $METHOD"
    echo ""
    
    # 檢查要求
    check_requirements
    
    # 列出專案資訊
    list_project_info
    
    # 檢查開發者身份
    check_developer_identity
    
    # 清理專案
    clean_project
    
    # 建立 Archive
    if ! build_archive; then
        log_error "Archive 建立失敗，停止打包"
        exit 1
    fi
    
    # 建立 ExportOptions.plist
    create_export_options
    
    # 匯出 IPA
    if ! export_ipa; then
        log_error "IPA 匯出失敗"
        exit 1
    fi
    
    # 驗證 IPA
    validate_ipa
    
    # 生成報告
    generate_report
    
    echo ""
    log_info "🎉 打包完成！"
    log_info "📁 建置目錄: $BUILD_DIR"
    log_info "📱 IPA 檔案: $(find "$BUILD_DIR" -name "*.ipa" | head -1)"
    log_info "📊 建置報告: $REPORT_FILE"
}

# 顯示使用說明
show_usage() {
    echo "使用方法: $0 [project_path] [scheme] [team_id] [method]"
    echo ""
    echo "參數說明:"
    echo "  project_path  專案檔案路徑 (.xcodeproj 或 .xcworkspace)"
    echo "  scheme        Scheme 名稱"
    echo "  team_id       開發者 Team ID"
    echo "  method        打包方法 (ad-hoc, app-store, development, enterprise)"
    echo ""
    echo "範例:"
    echo "  $0 MyApp.xcodeproj MyApp ABC123DEF456 ad-hoc"
    echo "  $0 MyApp.xcworkspace MyApp ABC123DEF456 app-store"
    echo ""
    echo "打包方法說明:"
    echo "  ad-hoc      - Ad Hoc 分發 (測試用)"
    echo "  app-store   - App Store 分發"
    echo "  development - 開發版本"
    echo "  enterprise  - 企業分發"
}

# 檢查參數
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_usage
    exit 0
fi

# 執行主函數
main
