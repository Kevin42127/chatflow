// ChatFlow 下載頁面 JavaScript 功能

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupSmoothScrolling();
    setupDownloadHandlers();
    setupModalHandlers();
    setupNavbarScroll();
    setupMobileNav();
});

// 初始化動畫效果
function initializeAnimations() {
    // 設定 Intersection Observer 用於滾動動畫
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 觀察所有卡片元素
    document.querySelectorAll('.feature-card, .download-card, .support-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 聊天泡泡動畫
    animateChatBubbles();
}

// 聊天泡泡動畫
function animateChatBubbles() {
    const bubbles = document.querySelectorAll('.chat-bubble');
    bubbles.forEach((bubble, index) => {
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
            bubble.style.transition = 'all 0.6s ease';
        }, 1000 + (index * 800));
    });
}

// 設定平滑滾動
function setupSmoothScrolling() {
    // 為所有錨點連結設定平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 滾動到下載區域
function scrollToDownload() {
    const downloadSection = document.getElementById('download');
    if (downloadSection) {
        downloadSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 滾動到功能區域
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 設定手機導航功能
function setupMobileNav() {
    console.log('Setting up mobile nav...');
    
    const navToggle = document.getElementById('navToggle');
    const navbarNav = document.querySelector('.navbar-nav');
    
    console.log('navToggle:', navToggle);
    console.log('navbarNav:', navbarNav);
    
    if (navToggle && navbarNav) {
        // 漢堡選單點擊事件
        navToggle.addEventListener('click', function(e) {
            console.log('Nav toggle clicked');
            e.preventDefault();
            e.stopPropagation();
            navbarNav.classList.toggle('active');
            console.log('Nav classes:', navbarNav.className);
        });
        
        // 點擊導航連結後關閉選單
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navbarNav.classList.remove('active');
            });
        });
        
        // 點擊導航選單外部關閉
        document.addEventListener('click', function(e) {
            if (!navbarNav.contains(e.target) && !navToggle.contains(e.target)) {
                navbarNav.classList.remove('active');
            }
        });
        
        // 防止選單內部點擊冒泡
        navbarNav.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    } else {
        console.error('Nav elements not found');
    }
}

// 導航切換功能（全域函數供 HTML 調用）
function toggleNav() {
    console.log('toggleNav called');
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        navbarNav.classList.toggle('active');
        console.log('Toggled nav, classes:', navbarNav.className);
    } else {
        console.error('navbarNav not found');
    }
}

// 設定下載處理器
function setupDownloadHandlers() {
    // iOS 下載 - 禁用狀態
    const iosDownload = () => {
        showModal('iOS 版本開發中', 'iOS 版本目前正在開發中，敬請期待！您可以先試用 Android 版本。');
    };

    // Android 下載
    const androidDownload = () => {
        // 直接下載 APK 檔案
        const downloadUrl = 'https://github.com/Kevin42127/chatflow/releases/download/android/chatflow.apk';
        
        // 建立隱藏的下載連結
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'chatflow.apk';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 同時開啟 Releases 頁面作為備用
        window.open('https://github.com/Kevin42127/chatflow/releases/tag/android', '_blank');
    };

    // 將函數綁定到全域
    window.downloadApp = (platform) => {
        if (platform === 'ios') iosDownload();
        else if (platform === 'android') androidDownload();
    };
}

// 顯示訊息模態框
function showModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">確定</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 模擬下載過程
function simulateDownload(platform, storeUrl) {
    const modal = document.getElementById('downloadModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const downloadStatus = document.getElementById('downloadStatus');

    // 顯示模態框
    modal.classList.add('show');

    // 重置進度
    let progress = 0;
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    // 更新狀態文字
    const statusMessages = {
        ios: ['正在連接 App Store...', '正在準備下載...', '正在下載 ChatFlow...', '正在安裝...', '完成！'],
        android: ['正在連接 Google Play...', '正在準備下載...', '正在下載 ChatFlow...', '正在安裝...', '完成！']
    };

    // 模擬下載進度
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';

        // 更新狀態訊息
        const messageIndex = Math.min(Math.floor(progress / 20), statusMessages[platform].length - 1);
        downloadStatus.textContent = statusMessages[platform][messageIndex];

        if (progress >= 100) {
            clearInterval(interval);
            
            // 延遲後關閉模態框並跳轉到商店
            setTimeout(() => {
                modal.classList.remove('show');
                window.open(storeUrl, '_blank');
            }, 1000);
        }
    }, 300);
}

// 設定模態框處理器
function setupModalHandlers() {
    const modal = document.getElementById('downloadModal');
    const closeBtn = document.querySelector('.modal-close');

    // 關閉模態框
    window.closeModal = () => {
        modal.classList.remove('show');
    };

    // 點擊背景關閉模態框
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC 鍵關閉模態框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

// 設定導航欄滾動效果
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // 滾動超過 100px 時添加陰影
        if (currentScrollY > 100) {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }

        lastScrollY = currentScrollY;
    });
}

// 按鈕點擊效果
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        // 創建漣漪效果
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // 移除舊的漣漪
        const oldRipple = button.querySelector('.ripple');
        if (oldRipple) {
            oldRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // 移除漣漪
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// 添加漣漪效果的 CSS
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// 支援按鈕點擊處理
document.querySelectorAll('.support-card .btn-text').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.support-card');
        const title = card.querySelector('.support-title').textContent;
        
        // 這裡可以根據不同的支援類型跳轉到相應頁面
        switch(title) {
            case '使用指南':
                window.open('/help', '_blank');
                break;
            case '客戶支援':
                window.open('/support', '_blank');
                break;
            case '意見回饋':
                window.open('/feedback', '_blank');
                break;
        }
    });
});

// 頁面載入進度指示器
function showPageLoadingProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'page-loading-progress';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .page-loading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.1);
        }
        
        .page-loading-progress .progress-bar {
            width: 100%;
            height: 100%;
            background: transparent;
        }
        
        .page-loading-progress .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #1976d2, #42a5f5);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(progressContainer);
    
    // 模擬頁面載入進度
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        
        progressContainer.querySelector('.progress-fill').style.width = progress + '%';
        
        if (progress >= 90) {
            clearInterval(interval);
            setTimeout(() => {
                progressContainer.style.opacity = '0';
                setTimeout(() => {
                    progressContainer.remove();
                }, 300);
            }, 500);
        }
    }, 100);
}

// 頁面載入時顯示進度
showPageLoadingProgress();

// 添加鍵盤導航支援
document.addEventListener('keydown', function(e) {
    // Tab 鍵導航
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// 鍵盤導航樣式
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation .btn:focus,
    .keyboard-navigation .nav-link:focus,
    .keyboard-navigation .download-btn:focus {
        outline: 2px solid #1976d2;
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardStyle);

// 效能優化：延遲載入圖片
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 初始化延遲載入
lazyLoadImages();

// 錯誤處理
window.addEventListener('error', function(e) {
    console.error('頁面錯誤:', e.error);
    // 可以在這裡添加錯誤報告邏輯
});

// 效能監控
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('頁面載入時間:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

measurePerformance();
