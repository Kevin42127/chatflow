const EXPO_PROJECT_SLUG = 'chatflow';
const EXPO_ACCOUNT = 'kevin42127';

function downloadAndroid() {
    const button = document.getElementById('downloadAndroid');
    const originalText = button.innerHTML;
    
    button.disabled = true;
    button.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span><span>正在開啟下載頁面...</span>';

    try {
        const expoUrl = `https://expo.dev/accounts/${EXPO_ACCOUNT}/projects/${EXPO_PROJECT_SLUG}/builds`;
        window.open(expoUrl, '_blank');
        showNotification('已開啟 Expo 建置頁面，請選擇最新的 Android 建置下載', 'success');
        
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        console.error('開啟失敗:', error);
        showNotification('開啟失敗，請稍後再試', 'error');
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    const androidBtn = document.getElementById('downloadAndroid');
    const iosBtn = document.getElementById('downloadIOS');

    if (androidBtn) {
        androidBtn.addEventListener('click', downloadAndroid);
    }

    if (iosBtn) {
        iosBtn.addEventListener('click', () => {
            showNotification('iOS 版本即將推出，敬請期待！', 'error');
        });
    }
});
