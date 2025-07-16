// Town data
const towns = {
    tsurugi: '鶴来',
    mikawa: '美川',
    mattou: '松任',
    kawachi: '河内',
    shiramine: '白峰',
    yoshinodani: '吉野谷',
    torigoe: '鳥越',
    ichirino: '一里野'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStampDisplay();
    
    // Check for stamp parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const stampParam = urlParams.get('stamp');
    
    if (stampParam && towns[stampParam]) {
        // Add stamp to localStorage
        addStamp(stampParam);
        
        // Show notification (only if not already obtained)
        const stamps = getStamps();
        if (stamps.includes(stampParam)) {
            showStampNotification(towns[stampParam]);
        }
    }
});

// Get stamps from localStorage
function getStamps() {
    const stamps = localStorage.getItem('hakusan_stamps');
    return stamps ? JSON.parse(stamps) : [];
}

// Add stamp to localStorage
function addStamp(townCode) {
    const stamps = getStamps();
    if (!stamps.includes(townCode)) {
        stamps.push(townCode);
        localStorage.setItem('hakusan_stamps', JSON.stringify(stamps));
        updateStampDisplay();
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
    document.getElementById('stampCount').textContent = `${stampCount}/${totalStamps} スタンプ獲得`;
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressPercent = (stampCount / totalStamps) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // Update town cards
    Object.keys(towns).forEach(townCode => {
        const townCard = document.querySelector(`[data-town="${townCode}"]`);
        const stampStatus = document.getElementById(`stamp-${townCode}`);
        
        if (stamps.includes(townCode)) {
            townCard.classList.add('completed');
            stampStatus.textContent = '✅ GET!';
            stampStatus.classList.add('obtained');
        } else {
            townCard.classList.remove('completed');
            stampStatus.textContent = '未取得';
            stampStatus.classList.remove('obtained');
        }
    });
    
    // Update map pins
    Object.keys(towns).forEach(townCode => {
        const mapTown = document.querySelector(`.map-town[data-town="${townCode}"]`);
        if (mapTown) {
            if (stamps.includes(townCode)) {
                mapTown.classList.add('completed');
            } else {
                mapTown.classList.remove('completed');
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
function showStampNotification(townName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'stamp-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h3>🎉 スタンプ獲得！</h3>
            <p>${townName}のスタンプを獲得しました！</p>
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
    const shareText = '白山市NFCスタンプラリー「はくさんバッジクエスト」で全8市町村のスタンプを集めました！🎉';
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'はくさんバッジクエスト完全制覇！',
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
    if (confirm('本当にスタンプをリセットしますか？この操作は取り消せません。')) {
        localStorage.removeItem('hakusan_stamps');
        updateStampDisplay();
        closeSpecialContent();
        alert('スタンプをリセットしました。新しい冒険を始めましょう！');
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
