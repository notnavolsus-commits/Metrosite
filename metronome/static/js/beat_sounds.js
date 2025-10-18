class BeatSounds {
    constructor(metronome) {
        this.metronome = metronome;
        this.audioContext = null;
        this.soundConfigs = [];
        this.defaultSounds = this.getDefaultSounds();

        this.init();
    }

    init() {
        this.loadSoundConfigs();
        this.setupEventListeners();
        this.renderSoundConfiguration();
    }

    getDefaultSounds() {
        return [
            { beatPosition: 0, soundType: 'bell', volume: 100 }, // Сильная доля
            { beatPosition: 1, soundType: 'click', volume: 80 },
            { beatPosition: 2, soundType: 'click', volume: 80 },
            { beatPosition: 3, soundType: 'click', volume: 80 },
        ];
    }

    loadSoundConfigs() {
        // Пока используются звуки по умолчанию
        // Позже можно загружать из localStorage или сервера
        const saved = localStorage.getItem('beatSounds');
        this.soundConfigs = saved ? JSON.parse(saved) : this.defaultSounds;
    }

    saveSoundConfigs() {
        localStorage.setItem('beatSounds', JSON.stringify(this.soundConfigs));
    }

    setupEventListeners() {
        //Обработчики будут добавлены после рендера конфигурации
    }

    renderSoundConfiguration() {
        const container = document.getElementById('sounds-configuration');
        if (!container) return;

        const beatsCount = this.metronome.beatsPerMeasure;

        // Создаём конфигурацию для каждой доли
        container.innerHTML = '';

        for (let i = 0; i < beatsCount; i++) {
            const isStrongBeat = i === 0;
            const config = this.soundConfigs.find(s => s.beatPosition === i) || { beatPosition: i, soundType: 'click', volume: 80 };

            const beatConfig = document.createElement('div');
            beatConfig.className = `beat-sound-config ${isStrongBeat ? 'strong-beat' : ''}`;
            beatConfig.innerHTML = `
                <div class="beat-position">Доля ${i + 1}</div>
                <select class="sound-select" data-beat="${i}">
                    <option value="click" ${config.soundType === 'click' ? 'selected' : ''}>Клик</option>
                    <option value="beep" ${config.soundType === 'beep' ? 'selected' : ''}>Бип</option>
                    <option value="woodblock" ${config.soundType === 'woodblock' ? 'selected' : ''}>Вудблок</option>
                    <option value="drum" ${config.soundType === 'drum' ? 'selected' : ''}>Барабаны</option>
                    <option value="bell" ${config.soundType === 'bell' ? 'selected' : ''}>Колокольчик</option>
                    <option value="triangle" ${config.soundType === 'triangle' ? 'selected' : ''}>Треугольник</option>
                    <option value="cowbell" ${config.soundType === 'cowbell' ? 'selected' : ''}>Ковбелл</option>
                    <option value="tambourine" ${config.soundType === 'tambourine' ? 'selected' : ''}>Бубен</option>
                </select>
                <input type="range" class="volume-slider" data-beat="${i}"
                    min="0" max="100" value="${config.volume}">
                <span class="volume-value">${config.volume}%</span>
                <button class="test-sound-btn" data-beat="${i}">▶</button> 
            `;

            container.appendChild(beatConfig);
        }

        this.setupConfigurationListeners();
        this.setupPresetListeners();

    }

    setupConfigurationListeners() {
        // Обработчики выбора звука
        document.querySelectorAll('.sound-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const beat = parseInt(e.target.dataset.beat);
                const soundType = e.target.value;
                this.updateSoundConfig(beat, 'soundType', soundType);
            });
        });

        // Обработчики громкости
        document.querySelectorAll('.volume-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const beat = parseInt(e.target.dataset.beat);
                const volume = parseInt(e.target.value);
                e.target.nextElementSibling.textContent = `${volume}%`;
                this.updateSoundConfig(beat, 'volume', volume);
            });
        });

        // Кнопки тестирования звуков
        document.querySelectorAll('.test-sound-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const beat = parseInt(e.target.dataset.beat);
                this.playTestSound(beat);
            });
        });
    }

    setupPresetListeners() {
        document.querySelectorAll('.sound-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applySoundPreset(preset);
            });
        });
    }

    updateSoundConfig(beatPosition, property, value) {
        let config = this.soundConfigs.find(s => s.beatPosition === beatPosition);

        if (!config) {
            config = { beatPosition, soundType: 'click', volume: 80};
            this.soundConfigs.push(config);
        }

        config[property] = value;
        this.saveSoundConfigs();
    }

    playTestSound(beatPosition) {
        const config = this.soundConfigs.find(s => s.beatPosition === beatPosition) || { soundType: 'click', volume: 80};

        this.playSound(config.soundType, config.volume / 100);
    }

    playSound(soundType, volume = 0.7) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        //Настраиваем звук в зависимости от типа
        const soundParams = this.getSoundParameters(soundType);
        oscillator.frequency.setValueAtTime(soundParams.frequency, this.audioContext.currentTime);
        oscillator.type = soundParams.waveType;

        // Настраиваем огибающую
        gainNode.gain.setValueAtTime(volume * (this.metronome.volume / 100), this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + soundParams.duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + soundParams.duration);
    }

    getSoundParameters(soundType) {
        const params = {
            'click': { frequency: 1000, duration: 0.05, waveType: 'square' },
            'beep': { frequency: 800, duration: 0.1, waveType: 'sine'},
            'woodblock': { frequency: 600, duration: 0.08, waveType: 'sawtooth'},
            'drum': { frequency: 150, duration: 0.2, waveType: 'sine'},
            'bell': { frequency: 1200, duration: 0.3, waveType: 'sine'},
            'triangle': { frequency: 900, duration: 0.15, waveType: 'triangle'},
            'cowbell': { frequency: 700, duration: 0.12, waveType: 'square'},
            'tambourine': { frequency: 500, duration: 0.25, waveType: 'sawtooth'}
        };

        return params[soundType] || params.click;
    }

    applySoundPreset(preset) {
        const presets = {
            'classic': [
                { beatPosition: 0, soundType: 'bell', volume: 100},
                { beatPosition: 1, soundType: 'click', volume: 70},
                { beatPosition: 2, soundType: 'click', volume: 70},
                { beatPosition: 3, soundType: 'click', volume: 70}
            ],
            'drums': [
                { beatPosition: 0, soundType: 'drum', volume: 100},
                { beatPosition: 1, soundType: 'woodblock', volume: 80},
                { beatPosition: 2, soundType: 'woodblock', volume: 80},
                { beatPosition: 3, soundType: 'woodblock', volume: 80}
            ],
            'electronic': [
                { beatPosition: 0, soundType: 'beep', volume: 100},
                { beatPosition: 1, soundType: 'click', volume: 60},
                { beatPosition: 2, soundType: 'click', volume: 60},
                { beatPosition: 3, soundType: 'click', volume: 60}
            ],
            'orchestra': [
                { beatPosition: 0, soundType: 'bell', volume: 100},
                { beatPosition: 1, soundType: 'triangle', volume: 80},
                { beatPosition: 2, soundType: 'triangle', volume: 80},
                { beatPosition: 3, soundType: 'tambourine', volume: 70}
            ]
        };

        this.soundConfigs = presets[preset] || this.defaultSounds;
        this.saveSoundConfigs();
        this.renderSoundConfiguration();

        this.showNotification(`Применён пресет: ${preset}`);
    }

    // Метод для произведения звука ноты
    playBeatSound(beatPosition) {
        const config = this.soundConfigs.find(s => s.beatPosition === beatPosition) || {soundType: 'click', volume: 80};

        this.playSound(config.soundType, config.volume / 100);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}
