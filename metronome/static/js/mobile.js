class MobileOptimizer {
    constructor(metronome) {
        this.metronome = metronome;
        this.setupMobileFeatures();
    }

    setupMobileFeatures() {
        this.setupSwipeGestures();
        this.preventZoom();
        this.enhanceTouchFeedback();
        this.setupVibration();
    }

    // Свайп жесты для изменения BPM
    setupSwipeGestures() {
        const bpmDisplay = document.querySelector('.bpm-display');
        if (!bpmDisplay) return;

        let startX = 0;
        let startY = 0;

        bpmDisplay.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        }, { passive: true });

        bpmDisplay.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;

            const diffX = startX - currentX;
            const diffY = startY - currentY;

            // Определяем направление свайпа
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
                if (diffX > 0) {
                    // Свайп влево - уменьшить BPM
                    this.changeBpm(-5);
                } else {
                    // Свайп вправо - увеличить BPM
                    this.changeBpm(5);
                }
                startX = 0;
                startY = 0;
                e.preventDefault();
            }
        }, {passive: true });

        bpmDisplay.style.cursor = 'grab';
    }

    changeBpm(delta) {
        const currentBpm = this.metronome.settings.bpm;
        const newBpm = Math.max(40, Math.min(300, currentBpm + delta));

        this.metronome.updateBpm(newBpm);

        // Обновляем UI
        const bpmInput = document.querySelector('[name="bpm"]');
        if (bpmInput) bpmInput.value = newBpm;

        document.getElementById('current-bpm').textContent = newBpm;

        // Визуальная обратная связь
        this.showSwipeFeedback(delta > 0 ? '+5 BPM' : '-5 BPM');
    }

    showSwipeFeedback(message) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1000;
            font-size: 18px;
            pointer:-events: none;
            transition: opacity 0.5s;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 500);
        }, 1000);
    }

    // Предотвращаем масштабирование при двойном тапе
    preventZoom() {
        let lastTouchEnd = 0;

        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }

    // Улучшаем обратную связь при касании
    enhanceTouchFeedback() {
        document.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.target.style.transform = 'scale(0.95)';
                e.target.style.opacity = '1';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.target.style.transform = 'scale(1)';
                e.target.style.opacity = '1';
            }
        });
    }

    // Вибрация (если поддерживается)
    setupVibration() {
        if ('vibrate' in navigator) {
            const playButton = document.getElementById('play-button');
            if (playButton) {
                playButton.addEventListener('click', () => {
                    navigator.vibrate(50);
                });
            }
        }
    }

    // Определяем мобильное устройство
     isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
     }
}