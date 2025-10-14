class TapTempo {
    constructor(metronome) {
        this.metronome = metronome;
        this.tapTimes = [];
        this.maxTaps = 4; // Количество тапов для расчёта
        this.timeout = null;
        this.isActive = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const tapButton = document.getElementById('tap-tempo');
        const tapFeedback = document.getElementById('tap-feedback');

        if (tapButton) {
            // Клик по кнопке
            tapButton.addEventListener('click', () => {
                this.handleTap();
            });

            // Клавиша "Т" на клавиатуре
            document.addEventListener('keydown', (e) => {
                if (e.code === 'KeyT' && !e.repeat) {
                    e.preventDefault();
                    this.handleTap();
                    this.animateTapButton();
                }
            });
        }
    }

    handleTap() {
        const now = Date.now();

        // Добавляем текущее время тапа
        this.tapTimes.push(now);

        // Ограничиваем количество тапов
        if (this.tapTimes.length > this.maxTaps) {
            this.tapTimes.shift();
        }

        // Обновляем визуальную обратную связь
        this.updateFeedback();

        // Рассчитываем BPM при каждом тапе
        if (this.tapTimes.length >= 2) {
            this.calculateBPM();
        }

        // Сбрасываем тапы через 2 секунды бездействия
        this.resetAfterTimeout();
    }

    calculateBPM() {
        const intervals = [];

        // Рассчитываем интервалы между тапами
        for (let i = 1; i < this.tapTimes.length; i++) {
            const interval = this.tapTimes[i] - this.tapTimes[i - 1];
            intervals.push(interval);
        }

        // Средний интервал в миллисекундах
        const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

        // BPM = 60000 / средний_интервал_в_м/c
        const calculatedBPM = Math.round(60000 / averageInterval);

        // Ограничиваем диапазон BPM
        const clampedBPM = Math.max(30, Math.min(300, calculatedBPM));

        // Обновляем BPM в метрономе
        this.updateBPM(clampedBPM);

        return clampedBPM;
    }


    updateBPM (newBPM) {
        // Обновляем метроном
        this.metronome.updateBpm(newBPM);

        // Обновляем поле ввода BPM
        const bpmField = document.querySelector('[name="bpm"]') || document.getElementById('id_bpm');
        if (bpmField) {
            bpmField.value = newBPM;
        }

        // Обновляем отображение BPM
        const currentBpmDisplay = document.getElementById('current-bpm');
        if (currentBpmDisplay) {
            currentBpmDisplay.textContent = newBPM;
        }

        // Отправляем событие об изменении BPM
        const event = new CustomEvent('bpm-changed', { detail : { bpm: newBPM } });
        document.dispatchEvent(event);
    }

    updateFeedback() {
        const tapFeedback = document.getElementById('tap-feedback');
        if (!tapFeedback) return;

        const tapCount = this.tapTimes.length;

        if (tapCount === 1) {
            tapFeedback.textContent = 'Тапните ещё раз...';
            tapFeedback.style.color = '#ff6b6b';
        } else if (tapCount >= 2) {
            const bpm = this.calculateBPM();
            tapFeedback.textContent = `BPM: ${bpm} (${tapCount}/${this.maxTaps} тапов)`;
            tapFeedback.style.color = '#4CAF50';
        }
    }

    animateTapButton() {
        const tapButton = document.getElementById('tap-tempo');
        if (tapButton) {
            tapButton.classList.add('tapping');
            setTimeout(() => {
                tapButton.classList.remove('tapping');
            }, 200);
        }
    }

    resetAfterTimeout() {
        // Сбрасываем предыдущий таймаут
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.tapTimes = [];
            this.updateFeedback();
        }, 2000); // Сброс через 2 секунды
    }

    // Метод для сброса тапов
    reset() {
        this.tapTimes = [];
        this.updateFeedback();
    }
}