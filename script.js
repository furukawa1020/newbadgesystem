// Town data
const towns = {
    tsurugi: '鶴来',
    mikawa: '美川',
    mattou: '松任',
    kawachi: '河内',
    shiramine: '白峰',
    yoshinodani: '吉野谷',
    torigoe: '鳥越',
    oguchi: '尾口'
};

// Badge data
const badges = {
    tsurugi: 'クレインバッジ',
    mikawa: 'ラッパバッジ',
    mattou: 'パインバッジ',
    kawachi: 'ブリッジバッジ',
    shiramine: 'ピークバッジ',
    yoshinodani: 'フォレストバッジ',
    torigoe: 'キャッスルバッジ',
    oguchi: 'フォールバッジ'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStampDisplay();
    
    // Check for stamp parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const stampParam = urlParams.get('badge');
    
    if (stampParam && towns[stampParam]) {
        // Add stamp to localStorage
        addStamp(stampParam);
        
        // Show notification (only if not already obtained)
        const stamps = getStamps();
        if (stamps.includes(stampParam)) {
            showStampNotification(towns[stampParam], badges[stampParam]);
        }
        
        // Remove badge parameter from URL
        const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newURL}, '', newURL);
    }
    
    // Initialize incentive content when available
    setTimeout(() => {
        if (window.incentiveSystem) {
            updateIncentiveContent();
        }
    }, 500);
});

// Get stamps from localStorage
function getStamps() {
    const stamps = localStorage.getItem('hakusan_badges');
    return stamps ? JSON.parse(stamps) : [];
}

// Add stamp to localStorage
function addStamp(townCode) {
    const stamps = getStamps();
    if (!stamps.includes(townCode)) {
        stamps.push(townCode);
        localStorage.setItem('hakusan_badges', JSON.stringify(stamps));
        
        // Get town and badge information
        const townData = towns[townCode];
        const badgeName = badges[townCode] || townData || townCode;
        
        // Fire incentive system event
        if (window.incentiveSystem) {
            window.incentiveSystem.onBadgeAcquired(townCode, badgeName);
        }
        
        // Dispatch custom event for other systems
        window.dispatchEvent(new CustomEvent('badgeAcquired', {
            detail: { gymId: townCode, badgeName: badgeName }
        }));
        
        updateStampDisplay();
        showStampNotification(badgeName, `${badgeName}バッジ`);
        
        return true;
    }
    return false;
}

// Update stamp display
function updateStampDisplay() {
    const stamps = getStamps();
    const stampCount = stamps.length;
    const totalStamps = Object.keys(towns).length;
    
    // Update counter
    document.getElementById('stampCount').textContent = `${stampCount}/${totalStamps} バッジ獲得`;
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressPercent = (stampCount / totalStamps) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // Update town cards
    Object.keys(towns).forEach(townCode => {
        const townCard = document.querySelector(`[data-town="${townCode}"]`);
        const stampStatus = document.getElementById(`stamp-${townCode}`);
        // より確実にbadgeIconを取得
        const badgeIcon = townCard ? townCard.querySelector('.badge-icon') : null;
        
        if (!townCard) {
            return;
        }
        
        if (stamps.includes(townCode)) {
            townCard.classList.add('completed');
            if (stampStatus) {
                stampStatus.textContent = '✅ 獲得済み';
                stampStatus.classList.add('obtained');
            }
            
            // Update badge icon based on gym type
            if (badgeIcon) {
                const gymBadgeIcons = {
                    'tsurugi': '🏹',     // クレインバッジ (弓矢)
                    'mikawa': '🎺',      // ラッパバッジ (ラッパ)
                    'mattou': '🌲',      // パインバッジ (松)
                    'kawachi': '🌉',      // ブリッジバッジ (橋)
                    'shiramine': '⛰️',    // ピークバッジ (山頂)
                    'yoshinodani': '🌳',  // フォレストバッジ (森)
                    'torigoe': '🏰',     // キャッスルバッジ (城)
                    'oguchi': '💧'       // フォールバッジ (滝)
                };
                badgeIcon.textContent = gymBadgeIcons[townCode] || '🏆';
            }
        } else {
            townCard.classList.remove('completed');
            if (stampStatus) {
                stampStatus.textContent = '未取得';
                stampStatus.classList.remove('obtained');
            }
            
            // Reset badge icon to question mark
            if (badgeIcon) {
                badgeIcon.textContent = '？';
            }
        }
    });
    
    // Update gym pins on map
    Object.keys(towns).forEach(townCode => {
        const gymPin = document.getElementById(`gym-${townCode}`);
        if (gymPin) {
            if (stamps.includes(townCode)) {
                gymPin.classList.add('completed');
                
                // Add rarity effects
                const badgeRarities = {
                    'oguchi': 'rare',
                    'kawachi': 'uncommon',
                    'mattou': 'common',
                    'mikawa': 'uncommon', 
                    'shiramine': 'legendary',
                    'torigoe': 'rare',
                    'tsurugi': 'uncommon',
                    'yoshinodani': 'rare'
                };
                
                const rarity = badgeRarities[townCode];
                gymPin.classList.add(`badge-rarity`, rarity);
                
                // Add rarity indicator
                if (!gymPin.querySelector('.rarity-indicator')) {
                    const rarityIndicator = document.createElement('div');
                    rarityIndicator.className = `rarity-indicator ${rarity}`;
                    const rarityIcons = {
                        'legendary': '🐉',
                        'rare': '💎',
                        'uncommon': '🌟', 
                        'common': '⭐'
                    };
                    rarityIndicator.textContent = rarityIcons[rarity];
                    gymPin.appendChild(rarityIndicator);
                }
                
                // Update badge appearance based on specific gym
                const badgeElement = gymPin.querySelector('.gym-badge');
                if (badgeElement) {
                    const gymIcons = {
                        'oguchi': '🧚‍♀️',
                        'kawachi': '🌊', 
                        'mattou': '⭐',
                        'mikawa': '🌍',
                        'shiramine': '❄️',
                        'torigoe': '🌿',
                        'tsurugi': '⚔️',
                        'yoshinodani': '💧'
                    };
                    badgeElement.textContent = gymIcons[townCode];
                    badgeElement.classList.add('premium-badge');
                }
            } else {
                gymPin.classList.remove('completed', 'badge-rarity', 'legendary', 'rare', 'uncommon', 'common');
                
                // Remove rarity indicator
                const rarityIndicator = gymPin.querySelector('.rarity-indicator');
                if (rarityIndicator) {
                    rarityIndicator.remove();
                }
                
                // Reset badge to unknown/locked state
                const badgeElement = gymPin.querySelector('.gym-badge');
                if (badgeElement) {
                    badgeElement.textContent = '？';
                    badgeElement.classList.remove('premium-badge');
                }
            }
        }
    });
    
    // Show complete section if all stamps collected
    const completeSection = document.getElementById('completeSection');
    if (stampCount === totalStamps) {
        completeSection.style.display = 'block';
        showCompletionCelebration();
    } else {
        completeSection.style.display = 'none';
    }
}

// Show stamp notification
function showStampNotification(townName, badgeName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'stamp-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>� バッジ獲得！</h3>
            <p>${townName}ジムで<br><strong>${badgeName}</strong>を獲得しました！</p>
            <button onclick="closeNotification()">OK</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        .notification-content h3 {
            color: #2ecc71;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        .notification-content p {
            margin-bottom: 1.5rem;
            color: #333;
        }
        
        .notification-content button {
            background: #2ecc71;
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .notification-content button:hover {
            background: #27ae60;
            transform: translateY(-2px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification();
        }
    }, 5000);
}

// Close notification
function closeNotification() {
    const notification = document.querySelector('.stamp-notification');
    if (notification) {
        notification.remove();
    }
}

// Show completion celebration
function showCompletionCelebration() {
    // Create confetti effect
    createConfetti();
    
    // Play celebration sound (if available)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+JHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBABQn+GzUkcGSKrmy2sxCwdJnODzvmMcBjJv0/LQeyn+');
        audio.play();
    } catch (e) {
        // Ignore audio errors
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                z-index: 1001;
                border-radius: 50%;
                animation: confettiFall 3s ease-in-out forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
    
    // Add confetti animation
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Visit town function
function visitTown(townCode) {
    const townUrl = `town/${townCode}.html`;
    window.location.href = townUrl;
}

// Show special content
function showSpecialContent() {
    const specialContent = `
        <div class="special-content-modal">
            <div class="special-content">
                <h2>🏆 おめでとうございます！ 🏆</h2>
                <p>白山市旧8市町村すべてのスタンプを集めました！</p>                <div class="completion-badge">
                    <div class="badge-content">
                        <h3>🌟 はくさんマスター 🌟</h3>
                        <p>白山市完全制覇証明書</p>
                        <small>完了日：${new Date().toLocaleDateString('ja-JP')}</small>
                    </div>
                </div>
                <p>あなたは白山市の魅力を余すことなく体験しました。<br>
                この素晴らしい経験を友人や家族とシェアしてください！</p>
                <div class="share-buttons">
                    <button onclick="shareCompletion()">🎉 シェアする</button>
                    <button onclick="resetStamps()">🔄 最初から始める</button>
                </div>
                <button onclick="closeSpecialContent()">閉じる</button>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = specialContent;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1002;
        animation: fadeIn 0.5s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .special-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            margin: 1rem;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            animation: slideInUp 0.5s ease;
        }
        
        .special-content h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .completion-badge {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .badge-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .share-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 1.5rem 0;
            flex-wrap: wrap;
        }
        
        .share-buttons button {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 0.8rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
        }
        
        .share-buttons button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        .special-content > button {
            background: white;
            color: #667eea;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .special-content > button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
        
        @keyframes slideInUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Close special content
function closeSpecialContent() {
    const modal = document.querySelector('.special-content-modal');
    if (modal) {
        modal.closest('div').remove();
    }
}

// Share completion
function shareCompletion() {
    const shareText = 'ハクサンリーグ・旧市町村ジムバッジで全8つのバッジを集めました！�';
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'ハクサンリーグチャンピオン完全制覇！',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `${shareText}\n${shareUrl}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('シェア用テキストをクリップボードにコピーしました！');
            });
        } else {
            alert(`シェア用テキスト：\n${text}`);
        }
    }
}

// Reset stamps (for testing or restart)
function resetStamps() {
    if (confirm('本当にバッジをリセットしますか？この操作は取り消せません。')) {
        localStorage.removeItem('hakusan_badges');
        updateStampDisplay();
        closeSpecialContent();
        alert('バッジをリセットしました。新しい冒険を始めましょう！');
    }
}

// Debug function (remove in production)
function debugAddAllStamps() {
    Object.keys(towns).forEach(townCode => {
        addStamp(townCode);
    });
}

// Add click handlers for map towns
document.addEventListener('click', function(e) {
    if (e.target.closest('.map-town')) {
        const townCode = e.target.closest('.map-town').getAttribute('data-town');
        if (townCode) {
            visitTown(townCode);
        }
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeNotification();
        closeSpecialContent();
    }
});

// Service worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Update incentive content containers
function updateIncentiveContent() {
    if (!window.incentiveSystem) return;
    
    // Update share section
    const shareContainer = document.querySelector('.share-container');
    if (shareContainer) {
        shareContainer.innerHTML = window.incentiveSystem.createShareSection();
    }
    
    // Update stats dashboard  
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsContainer.innerHTML = window.incentiveSystem.createStatsSection();
    }
    
    // Update secret content visibility
    window.incentiveSystem.updateSecretContentDisplay();
}

// Export function for use by incentive system
window.updateIncentiveContent = updateIncentiveContent;

// Map zoom and pan functionality
let currentZoom = 1;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let mapX = 0;
let mapY = 0;

// Initialize map controls
document.addEventListener('DOMContentLoaded', function() {
    const gameMap = document.getElementById('gameMap');
    if (gameMap) {
        // Mouse wheel zoom
        gameMap.addEventListener('wheel', function(e) {
            e.preventDefault();
            const rect = gameMap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (e.deltaY < 0) {
                zoomAtPoint(x, y, 1.2);
            } else {
                zoomAtPoint(x, y, 0.8);
            }
        });
        
        // Mouse drag to pan
        gameMap.addEventListener('mousedown', function(e) {
            if (currentZoom > 1) {
                isDragging = true;
                lastX = e.clientX;
                lastY = e.clientY;
                gameMap.classList.add('dragging');
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                const deltaY = e.clientY - lastY;
                mapX += deltaX;
                mapY += deltaY;
                
                // Constrain pan within reasonable bounds
                const maxPan = 200 * currentZoom;
                mapX = Math.max(-maxPan, Math.min(maxPan, mapX));
                mapY = Math.max(-maxPan, Math.min(maxPan, mapY));
                
                updateMapTransform();
                lastX = e.clientX;
                lastY = e.clientY;
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            gameMap.classList.remove('dragging');
        });
        
        // Touch support for mobile
        gameMap.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1 && currentZoom > 1) {
                isDragging = true;
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
                gameMap.classList.add('dragging');
            }
        });
        
        gameMap.addEventListener('touchmove', function(e) {
            if (isDragging && e.touches.length === 1) {
                e.preventDefault();
                const deltaX = e.touches[0].clientX - lastX;
                const deltaY = e.touches[0].clientY - lastY;
                mapX += deltaX;
                mapY += deltaY;
                
                const maxPan = 200 * currentZoom;
                mapX = Math.max(-maxPan, Math.min(maxPan, mapX));
                mapY = Math.max(-maxPan, Math.min(maxPan, mapY));
                
                updateMapTransform();
                lastX = e.touches[0].clientX;
                lastY = e.touches[0].clientY;
            }
        });
        
        gameMap.addEventListener('touchend', function() {
            isDragging = false;
            gameMap.classList.remove('dragging');
        });
    }
});

function zoomIn() {
    if (currentZoom < 3) {
        currentZoom = Math.min(3, currentZoom * 1.25);
        updateMapTransform();
        updateZoomDisplay();
    }
}

function zoomOut() {
    if (currentZoom > 0.5) {
        currentZoom = Math.max(0.5, currentZoom / 1.25);
        updateMapTransform();
        updateZoomDisplay();
        
        // Reset pan when zooming out to fit
        if (currentZoom <= 1) {
            mapX = 0;
            mapY = 0;
        }
    }
}

function resetZoom() {
    currentZoom = 1;
    mapX = 0;
    mapY = 0;
    updateMapTransform();
    updateZoomDisplay();
}

function zoomAtPoint(x, y, factor) {
    const gameMap = document.getElementById('gameMap');
    const rect = gameMap.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate offset from center
    const offsetX = x - centerX;
    const offsetY = y - centerY;
    
    const newZoom = Math.max(0.5, Math.min(3, currentZoom * factor));
    const zoomChange = newZoom / currentZoom;
    
    // Adjust pan to zoom towards the cursor position
    mapX -= offsetX * (zoomChange - 1);
    mapY -= offsetY * (zoomChange - 1);
    
    currentZoom = newZoom;
    
    // Constrain pan
    const maxPan = 200 * currentZoom;
    mapX = Math.max(-maxPan, Math.min(maxPan, mapX));
    mapY = Math.max(-maxPan, Math.min(maxPan, mapY));
    
    updateMapTransform();
    updateZoomDisplay();
}

function updateMapTransform() {
    const gameMap = document.getElementById('gameMap');
    if (gameMap) {
        gameMap.style.transform = `scale(${currentZoom}) translate(${mapX/currentZoom}px, ${mapY/currentZoom}px)`;
    }
}

function updateZoomDisplay() {
    const zoomLevel = document.getElementById('zoomLevel');
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
    }
}

// デバッグ用：バッジをリセットする関数（コンソールから実行可能）
window.resetAllBadges = function() {
    localStorage.removeItem('hakusan_badges');
    updateStampDisplay();
    console.log('All badges have been reset');
};

// デバッグ用：確認ダイアログ付きリセット関数（ボタンから実行）
function resetAllBadgesWithConfirm() {
    const confirmReset = confirm('本当に全てのバッジをリセットしますか？\n\nこの操作は取り消すことができません。');
    
    if (confirmReset) {
        localStorage.removeItem('hakusan_badges');
        updateStampDisplay();
        alert('全てのバッジがリセットされました。');
        
        // ページをリロードして完全にリセット
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}
