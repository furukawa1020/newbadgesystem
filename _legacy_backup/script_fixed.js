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
    console.log('Page loaded, initializing...');
    
    // First update display to show current state
    updateStampDisplay();
    
    // Check for stamp parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const stampParam = urlParams.get('badge');
    
    if (stampParam && towns[stampParam]) {
        console.log(`Badge parameter detected: ${stampParam}`);
        
        // Add stamp to localStorage
        const wasAdded = addStamp(stampParam);
        
        if (wasAdded) {
            console.log(`New badge added: ${stampParam}`);
            showStampNotification(towns[stampParam], badges[stampParam]);
        } else {
            console.log(`Badge already obtained: ${stampParam}`);
        }
        
        // Force update display after badge acquisition
        setTimeout(() => {
            updateStampDisplay();
        }, 100);
        
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
        
        console.log(`Badge acquired: ${townCode} - ${badgeName}`);
        
        return true;
    }
    return false;
}

// Update stamp display
function updateStampDisplay() {
    console.log('updateStampDisplay called');
    const stamps = getStamps();
    const stampCount = stamps.length;
    const totalStamps = Object.keys(towns).length;
    
    console.log('Current stamps:', stamps);
    console.log('Stamp count:', stampCount);
    
    // Update counter
    const stampCountElement = document.getElementById('stampCount');
    if (stampCountElement) {
        stampCountElement.textContent = `${stampCount}/${totalStamps} バッジ獲得`;
    }
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progressPercent = (stampCount / totalStamps) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }
    
    // Update town cards
    Object.keys(towns).forEach(townCode => {
        const townCard = document.querySelector(`[data-town="${townCode}"]`);
        const stampStatus = document.getElementById(`stamp-${townCode}`);
        
        if (!townCard) {
            console.log(`Town card not found for: ${townCode}`);
            return;
        }
        
        const badgeIcon = townCard.querySelector('.badge-icon');
        if (!badgeIcon) {
            console.log(`Badge icon not found for: ${townCode}`);
            return;
        }
        
        if (stamps.includes(townCode)) {
            // Mark as completed
            townCard.classList.add('completed');
            if (stampStatus) {
                stampStatus.textContent = '✅ 獲得済み';
                stampStatus.classList.add('obtained');
            }
            
            // Update badge icon based on gym type
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
            
            const newIcon = gymBadgeIcons[townCode] || '🏆';
            badgeIcon.innerHTML = newIcon;
            badgeIcon.classList.add('badge-obtained');
            
            console.log(`✅ Updated ${townCode} badge icon to: ${newIcon}`);
        } else {
            // Mark as not completed
            townCard.classList.remove('completed');
            if (stampStatus) {
                stampStatus.textContent = '未取得';
                stampStatus.classList.remove('obtained');
            }
            
            // Reset badge icon to question mark
            badgeIcon.innerHTML = '？';
            badgeIcon.classList.remove('badge-obtained');
            
            console.log(`❌ Reset ${townCode} badge icon to: ？`);
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
    if (completeSection) {
        if (stampCount === totalStamps) {
            completeSection.style.display = 'block';
            showCompletionCelebration();
        } else {
            completeSection.style.display = 'none';
        }
    }
}

// Show stamp notification
function showStampNotification(townName, badgeName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'stamp-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>🏆 バッジ獲得！</h3>
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
    
    // Add content styles
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeNotification();
    }, 3000);
}

// Close notification
function closeNotification() {
    const notification = document.querySelector('.stamp-notification');
    if (notification) {
        notification.remove();
    }
}

// Visit town function
function visitTown(townCode) {
    if (towns[townCode]) {
        window.location.href = `town/${townCode}.html`;
    }
}

// Show completion celebration
function showCompletionCelebration() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Show special content
function showSpecialContent() {
    alert('おめでとうございます！全てのジムバッジをコンプリートしました！');
}

// Reset all badges function for debugging
function resetAllBadgesWithConfirm() {
    if (confirm('全てのバッジをリセットしますか？この操作は元に戻せません。')) {
        localStorage.removeItem('hakusan_badges');
        updateStampDisplay();
        alert('全てのバッジをリセットしました。');
        console.log('All badges reset');
    }
}

// Debug function to test badge updates
function testBadgeUpdate(townCode) {
    console.log(`Testing badge update for: ${townCode}`);
    if (towns[townCode]) {
        addStamp(townCode);
        updateStampDisplay();
    } else {
        console.error(`Invalid town code: ${townCode}`);
    }
}

// Force update function for debugging
function forceUpdateDisplay() {
    console.log('Force updating display...');
    updateStampDisplay();
}

// Zoom functionality
let currentZoom = 1;
const maxZoom = 3;
const minZoom = 0.5;

function zoomIn() {
    if (currentZoom < maxZoom) {
        currentZoom += 0.25;
        applyZoom();
    }
}

function zoomOut() {
    if (currentZoom > minZoom) {
        currentZoom -= 0.25;
        applyZoom();
    }
}

function resetZoom() {
    currentZoom = 1;
    applyZoom();
}

function applyZoom() {
    const gameMap = document.getElementById('gameMap');
    const zoomLevel = document.getElementById('zoomLevel');
    
    if (gameMap) {
        gameMap.style.transform = `scale(${currentZoom})`;
    }
    
    if (zoomLevel) {
        zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
    }
}

// Pan functionality
let isPanning = false;
let startX, startY;
let translateX = 0, translateY = 0;

function initializePanFunctionality() {
    const gameMap = document.getElementById('gameMap');
    if (!gameMap) return;
    
    gameMap.addEventListener('mousedown', startPan);
    gameMap.addEventListener('mousemove', pan);
    gameMap.addEventListener('mouseup', endPan);
    gameMap.addEventListener('mouseleave', endPan);
    
    // Touch events
    gameMap.addEventListener('touchstart', startPanTouch);
    gameMap.addEventListener('touchmove', panTouch);
    gameMap.addEventListener('touchend', endPan);
}

function startPan(e) {
    isPanning = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
}

function startPanTouch(e) {
    isPanning = true;
    const touch = e.touches[0];
    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;
}

function pan(e) {
    if (!isPanning) return;
    e.preventDefault();
    
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    
    applyTransform();
}

function panTouch(e) {
    if (!isPanning) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    translateX = touch.clientX - startX;
    translateY = touch.clientY - startY;
    
    applyTransform();
}

function endPan() {
    isPanning = false;
}

function applyTransform() {
    const gameMap = document.getElementById('gameMap');
    if (gameMap) {
        gameMap.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
    }
}

// Initialize pan functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializePanFunctionality();
    }, 100);
});

// Update incentive content function (placeholder)
function updateIncentiveContent() {
    // This will be handled by the incentive system if available
    console.log('Incentive content update requested');
}
