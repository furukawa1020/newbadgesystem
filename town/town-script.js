// Town-specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const currentTown = getCurrentTownCode();
    updateTownStampStatus(currentTown);
    
    // Check URL for stamp parameter and process it
    const urlParams = new URLSearchParams(window.location.search);
    const stampParam = urlParams.get('stamp');
    
    if (stampParam && stampParam === currentTown) {
        processStampAcquisition(currentTown);
    }
});

// Get current town code from URL
function getCurrentTownCode() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    const townCode = filename.replace('.html', '');
    return townCode;
}

// Update stamp status display
function updateTownStampStatus(townCode) {
    const stamps = getStamps();
    const stampIcon = document.getElementById('stampIcon');
    const stampText = document.getElementById('stampText');
    const stampStatus = document.getElementById('stampStatus');
    
    if (stamps.includes(townCode)) {
        stampIcon.textContent = '✅';
        stampText.textContent = 'スタンプ獲得済み！';
        stampStatus.classList.add('obtained');
        document.body.classList.add('town-completed');
    } else {
        stampIcon.textContent = '📍';
        stampText.textContent = 'スタンプ未取得';
        stampStatus.classList.remove('obtained');
        document.body.classList.remove('town-completed');
    }
}

// Process stamp acquisition
function processStampAcquisition(townCode) {
    const stamps = getStamps();
    
    if (!stamps.includes(townCode)) {
        // Add stamp
        addStamp(townCode);
        
        // Update display
        updateTownStampStatus(townCode);
        
        // Show notification
        showTownStampNotification(townCode);
        
        // Add celebration effect
        createStampCelebration();
    }
}

// Show town-specific stamp notification
function showTownStampNotification(townCode) {
    const townNames = {
        tsurugi: '鶴来',
        mikawa: '美川',
        mattou: '松任',
        kawachi: '河内',
        shiramine: '白峰',
        yoshinodani: '吉野谷',
        torigoe: '鳥越',
        ichirino: '一里野'
    };
    
    const townName = townNames[townCode] || townCode;
    
    const notification = document.createElement('div');
    notification.className = 'town-stamp-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">🎉</div>
            <h3>スタンプ獲得！</h3>
            <p>${townName}のスタンプを獲得しました！</p>
            <div class="progress-info">
                <span id="notificationProgress">${getStamps().length}/8</span>
                <div class="mini-progress-bar">
                    <div class="mini-progress-fill" style="width: ${(getStamps().length / 8) * 100}%"></div>
                </div>
            </div>
            <button onclick="closeTownNotification()" class="close-btn">OK</button>
        </div>
    `;
    
    // Add styles for town notification
    const style = document.createElement('style');
    style.textContent = `
        .town-stamp-notification {
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
        }
        
        .town-stamp-notification .notification-content {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: bounceIn 0.5s ease;
        }
        
        .notification-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 1s infinite;
        }
        
        .town-stamp-notification h3 {
            color: #2ecc71;
            margin-bottom: 1rem;
            font-size: 1.8rem;
        }
        
        .town-stamp-notification p {
            margin-bottom: 1.5rem;
            color: #333;
            font-size: 1.1rem;
        }
        
        .progress-info {
            margin-bottom: 1.5rem;
        }
        
        .progress-info span {
            font-size: 1.2rem;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .mini-progress-bar {
            width: 100%;
            height: 10px;
            background: #ecf0f1;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 0.5rem;
        }
        
        .mini-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3498db, #2ecc71);
            border-radius: 5px;
            transition: width 0.5s ease;
        }
        
        .close-btn {
            background: #2ecc71;
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
        }
        
        .close-btn:hover {
            background: #27ae60;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
        }
        
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto close after 8 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeTownNotification();
        }
    }, 8000);
}

// Close town notification
function closeTownNotification() {
    const notification = document.querySelector('.town-stamp-notification');
    if (notification) {
        notification.remove();
    }
}

// Create stamp celebration effect
function createStampCelebration() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    
    // Create multiple bursts
    for (let burst = 0; burst < 3; burst++) {
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: 50%;
                    left: 50%;
                    z-index: 999;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: celebrationParticle 2s ease-out forwards;
                `;
                
                // Random direction
                const angle = (Math.PI * 2 * i) / 20;
                const velocity = 50 + Math.random() * 100;
                
                particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}px`);
                particle.style.setProperty('--dy', `${Math.sin(angle) * velocity}px`);
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }
        }, burst * 200);
    }
    
    // Add particle animation
    if (!document.querySelector('#celebration-style')) {
        const style = document.createElement('style');
        style.id = 'celebration-style';
        style.textContent = `
            @keyframes celebrationParticle {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--dx), var(--dy)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Navigation functions
function goBack() {
    window.location.href = '../index.html';
}

function suggestNextTown() {
    const stamps = getStamps();
    const allTowns = ['tsurugi', 'mikawa', 'mattou', 'kawachi', 'shiramine', 'yoshinodani', 'torigoe', 'ichirino'];
    const currentTown = getCurrentTownCode();
    
    // Find unvisited towns
    const unvisitedTowns = allTowns.filter(town => !stamps.includes(town) && town !== currentTown);
    
    if (unvisitedTowns.length > 0) {
        const randomTown = unvisitedTowns[Math.floor(Math.random() * unvisitedTowns.length)];
        const townNames = {
            tsurugi: '鶴来',
            mikawa: '美川',
            mattou: '松任',
            kawachi: '河内',
            shiramine: '白峰',
            yoshinodani: '吉野谷',
            torigoe: '鳥越',
            ichirino: '一里野'
        };
        
        if (confirm(`次は${townNames[randomTown]}を訪れてみませんか？`)) {
            window.location.href = `${randomTown}.html`;
        }
    } else {
        alert('すべての町を訪れました！トップページで特別コンテンツをお楽しみください。');
        goBack();
    }
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add reading progress indicator
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// Initialize reading progress
addReadingProgress();

// Add lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
