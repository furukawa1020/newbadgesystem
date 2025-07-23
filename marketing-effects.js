// Special Effects and Marketing Features
// 観光客爆売れのための特別エフェクト

class MarketingEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupSpecialEffects();
        this.setupMarketingFeatures();
        this.addLimitedTimeOffers();
    }

    // ===========================================
    // 特別視覚エフェクト
    // ===========================================
    
    createBadgeAcquisitionEffect(badgeType, rarity = 'common') {
        // 花火エフェクト
        this.createFireworks();
        
        // バッジ光るエフェクト
        this.createBadgeGlowEffect(badgeType, rarity);
        
        // 画面震えエフェクト
        this.createScreenShake();
        
        // サウンドエフェクト
        this.playBadgeSound(rarity);
        
        // レア度別特別エフェクト
        if (rarity === 'legendary') {
            this.createLegendaryEffect();
        } else if (rarity === 'rare') {
            this.createRareEffect();
        }
    }

    createFireworks() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 50 + 20}%;
                    left: ${Math.random() * 80 + 10}%;
                    width: 6px;
                    height: 6px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    z-index: 9999;
                    pointer-events: none;
                    animation: fireworkExplode 1s ease-out forwards;
                `;
                
                document.body.appendChild(firework);
                setTimeout(() => firework.remove(), 1000);
            }, i * 100);
        }
        
        // 花火アニメーション
        if (!document.querySelector('#firework-animations')) {
            const style = document.createElement('style');
            style.id = 'firework-animations';
            style.textContent = `
                @keyframes fireworkExplode {
                    0% { 
                        transform: scale(0); 
                        opacity: 1; 
                        box-shadow: 0 0 0px currentColor;
                    }
                    50% { 
                        transform: scale(3); 
                        opacity: 0.8;
                        box-shadow: 0 0 20px currentColor;
                    }
                    100% { 
                        transform: scale(6); 
                        opacity: 0;
                        box-shadow: 0 0 40px currentColor;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createBadgeGlowEffect(badgeType, rarity) {
        const glowColors = {
            'legendary': '#9b59b6',
            'rare': '#3498db',
            'uncommon': '#2ecc71',
            'common': '#95a5a6'
        };
        
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, ${glowColors[rarity]} 0%, transparent 70%);
            border-radius: 50%;
            z-index: 9998;
            pointer-events: none;
            animation: badgeGlowPulse 2s ease-in-out;
        `;
        
        document.body.appendChild(glow);
        setTimeout(() => glow.remove(), 2000);
        
        // バッジグローアニメーション
        if (!document.querySelector('#badge-glow-animations')) {
            const style = document.createElement('style');
            style.id = 'badge-glow-animations';
            style.textContent = `
                @keyframes badgeGlowPulse {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
                    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createScreenShake() {
        document.body.style.animation = 'screenShake 0.5s ease-in-out';
        
        if (!document.querySelector('#shake-animations')) {
            const style = document.createElement('style');
            style.id = 'shake-animations';
            style.textContent = `
                @keyframes screenShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }

    createLegendaryEffect() {
        // 伝説バッジ用の特別エフェクト
        const legendaryOverlay = document.createElement('div');
        legendaryOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                rgba(155, 89, 182, 0.3) 0%, 
                rgba(142, 68, 173, 0.3) 50%, 
                rgba(155, 89, 182, 0.3) 100%);
            z-index: 9997;
            pointer-events: none;
            animation: legendaryPulse 3s ease-in-out;
        `;
        
        document.body.appendChild(legendaryOverlay);
        setTimeout(() => legendaryOverlay.remove(), 3000);
        
        // レジェンダリーパルスアニメーション
        if (!document.querySelector('#legendary-animations')) {
            const style = document.createElement('style');
            style.id = 'legendary-animations';
            style.textContent = `
                @keyframes legendaryPulse {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createRareEffect() {
        // レアバッジ用のエフェクト
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    font-size: 2rem;
                    z-index: 9999;
                    pointer-events: none;
                    animation: sparkleFloat 2s ease-out forwards;
                `;
                
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 2000);
            }, i * 200);
        }
        
        if (!document.querySelector('#sparkle-animations')) {
            const style = document.createElement('style');
            style.id = 'sparkle-animations';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% { opacity: 0; transform: translateY(0px) rotate(0deg); }
                    50% { opacity: 1; transform: translateY(-30px) rotate(180deg); }
                    100% { opacity: 0; transform: translateY(-60px) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    playBadgeSound(rarity) {
        // 簡単な音階でサウンドエフェクトを作成
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const context = new AudioContext();
                
                const frequencies = {
                    'legendary': [523.25, 659.25, 783.99, 1046.50], // C-E-G-C
                    'rare': [523.25, 659.25, 783.99], // C-E-G
                    'uncommon': [523.25, 659.25], // C-E
                    'common': [523.25] // C
                };
                
                const freqs = frequencies[rarity] || frequencies.common;
                
                freqs.forEach((freq, index) => {
                    setTimeout(() => {
                        const oscillator = context.createOscillator();
                        const gainNode = context.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(context.destination);
                        
                        oscillator.frequency.setValueAtTime(freq, context.currentTime);
                        gainNode.gain.setValueAtTime(0.1, context.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
                        
                        oscillator.start(context.currentTime);
                        oscillator.stop(context.currentTime + 0.3);
                    }, index * 150);
                });
            } catch (e) {
                console.log('Audio context not available');
            }
        }
    }

    // ===========================================
    // マーケティング機能
    // ===========================================
    
    setupMarketingFeatures() {
        // QRコード生成機能
        this.addQRCodeSharing();
        
        // 口コミシェア機能
        this.addReviewSharing();
        
        // グループ挑戦機能
        this.addGroupChallenge();
        
        // リピーター特典
        this.addRepeaterBonus();
    }

    addQRCodeSharing() {
        // 各バッジ獲得時にQRコードを生成して共有可能にする
        window.addEventListener('badgeAcquired', (event) => {
            const { gymId } = event.detail;
            this.generateBadgeQR(gymId);
        });
    }

    generateBadgeQR(gymId) {
        // QRコード生成のシミュレーション（実際のQRライブラリを使用する場合）
        const shareData = {
            title: 'ハクサンリーグバッジ獲得！',
            text: `${gymId}ジムのバッジを獲得しました！`,
            url: `${window.location.origin}?badge=${gymId}`
        };
        
        // Web Share API対応チェック
        if (navigator.share) {
            navigator.share(shareData).catch(err => console.log('Error sharing:', err));
        } else {
            // フォールバック：クリップボードにコピー
            navigator.clipboard.writeText(shareData.url).then(() => {
                this.showToast('🔗 共有リンクをコピーしました！友達に送ってください。');
            });
        }
    }

    addReviewSharing() {
        // 体験レビュー投稿機能
        const reviewButton = document.createElement('button');
        reviewButton.className = 'review-share-btn';
        reviewButton.innerHTML = '📝 体験レビューを投稿';
        reviewButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(45deg, #e67e22, #f39c12);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;
        
        reviewButton.addEventListener('click', () => this.openReviewModal());
        document.body.appendChild(reviewButton);
    }

    openReviewModal() {
        const modal = document.createElement('div');
        modal.className = 'review-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            ">
                <h3>🌟 体験レビューを投稿</h3>
                <p>あなたの白山市体験を他の観光客にシェアしてください！</p>
                <div style="margin: 1rem 0;">
                    <button onclick="window.open('https://www.google.com/search?q=白山市+観光+レビュー', '_blank')" 
                            style="background: #4285f4; color: white; border: none; padding: 1rem 2rem; margin: 0.5rem; border-radius: 10px; cursor: pointer;">
                        Googleレビュー
                    </button>
                    <button onclick="window.open('https://www.tripadvisor.jp/', '_blank')"
                            style="background: #00af87; color: white; border: none; padding: 1rem 2rem; margin: 0.5rem; border-radius: 10px; cursor: pointer;">
                        TripAdvisor
                    </button>
                </div>
                <button onclick="this.closest('.review-modal').remove()" 
                        style="background: #95a5a6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 10px; cursor: pointer;">
                    閉じる
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    addGroupChallenge() {
        // グループ挑戦モード
        if (localStorage.getItem('group_challenge_mode')) {
            this.showGroupProgress();
        }
        
        // グループチャレンジボタン追加
        const groupBtn = document.createElement('button');
        groupBtn.innerHTML = '👥 グループチャレンジ';
        groupBtn.className = 'group-challenge-btn';
        groupBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(45deg, #8e44ad, #9b59b6);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        `;
        
        groupBtn.addEventListener('click', () => this.startGroupChallenge());
        document.body.appendChild(groupBtn);
    }

    startGroupChallenge() {
        const groupId = this.generateGroupId();
        localStorage.setItem('group_challenge_mode', 'true');
        localStorage.setItem('group_id', groupId);
        
        this.showToast(`🎉 グループチャレンジ開始！\nグループID: ${groupId}\n友達にこのIDを教えてください。`);
    }

    generateGroupId() {
        return Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    addRepeaterBonus() {
        // リピーター特典システム
        const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
        localStorage.setItem('visit_count', visitCount.toString());
        
        if (visitCount >= 3) {
            this.showRepeaterBonus(visitCount);
        }
    }

    showRepeaterBonus(visitCount) {
        const bonusModal = document.createElement('div');
        bonusModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #f39c12, #e67e22);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            z-index: 2000;
            border: 3px solid #d35400;
        `;
        
        bonusModal.innerHTML = `
            <h3>🎖️ リピーター特典！</h3>
            <p>${visitCount}回目の訪問ありがとうございます！</p>
            <p>特典：道の駅での10%割引クーポン</p>
            <button onclick="this.parentElement.remove()" style="
                background: white;
                color: #e67e22;
                border: none;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 1rem;
            ">クーポンを取得</button>
        `;
        
        document.body.appendChild(bonusModal);
    }

    addLimitedTimeOffers() {
        // 期間限定オファー
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const isEvening = now.getHours() >= 17;
        
        if (isWeekend) {
            this.showLimitedOffer('週末特典', '土日限定！バッジセット購入で送料無料！', '#e74c3c');
        }
        
        if (isEvening) {
            this.showLimitedOffer('夕方特典', '17時以降限定！フォトコンテスト投稿でグッズプレゼント！', '#f39c12');
        }
    }

    showLimitedOffer(title, description, color) {
        const offer = document.createElement('div');
        offer.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 1000;
            animation: offerPulse 2s infinite;
            cursor: pointer;
            text-align: center;
        `;
        
        offer.innerHTML = `
            <strong>⚡ ${title}</strong><br>
            <small>${description}</small>
        `;
        
        offer.addEventListener('click', () => {
            alert('詳細は最寄りの道の駅でお尋ねください！');
            offer.remove();
        });
        
        document.body.appendChild(offer);
        
        // 30秒後に自動削除
        setTimeout(() => {
            if (offer.parentElement) offer.remove();
        }, 30000);
        
        if (!document.querySelector('#offer-animations')) {
            const style = document.createElement('style');
            style.id = 'offer-animations';
            style.textContent = `
                @keyframes offerPulse {
                    0%, 100% { transform: translateX(-50%) scale(1); }
                    50% { transform: translateX(-50%) scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 2000;
            animation: toastSlide 0.5s ease;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlide 0.5s ease reverse';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
        
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes toastSlide {
                    0% { transform: translateX(-50%) translateY(100px); opacity: 0; }
                    100% { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// バッジ獲得時のエフェクトをグローバルに利用可能にする
window.triggerBadgeEffect = function(badgeType, rarity) {
    if (window.marketingEffects) {
        window.marketingEffects.createBadgeAcquisitionEffect(badgeType, rarity);
    }
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    window.marketingEffects = new MarketingEffects();
});

// バッジ獲得イベントをリスンして特別エフェクトを発動
window.addEventListener('badgeAcquired', (event) => {
    const { gymId } = event.detail;
    
    // レア度を取得
    const rarities = {
        'shiramine': 'legendary',
        'oguchi': 'rare',
        'torigoe': 'rare', 
        'yoshinodani': 'rare',
        'kawachi': 'uncommon',
        'mikawa': 'uncommon',
        'tsurugi': 'uncommon',
        'mattou': 'common'
    };
    
    const rarity = rarities[gymId] || 'common';
    
    // 特別エフェクト発動
    if (window.marketingEffects) {
        window.marketingEffects.createBadgeAcquisitionEffect(gymId, rarity);
    }
});
