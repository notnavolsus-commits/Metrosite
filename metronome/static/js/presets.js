class TempoPresets {
    constructor(metronome) {
        this.metronome = metronome;
        this.currentPreset = null;
        this.presets = [];

        this.init();
    }

    async init() {
        await this.loadPresets();
        this.setupEventListeners();
    }

    async loadPresets() {
        try {
            // Загружаем пресеты с сервера
            const response = await fetch('api/presets/');
            if (response.ok) {
                this.presets = await response.json();
            } else {
                // Если API нет, используем встроенные пресеты
                this.presets = this.getDefaultPresets();
            }
        } catch (error) {
            console.log('Используем встроенные пресеты');
            this.presets = this.getDefaultPresets();
        }
    }

    getDefaultPresets() {
        return [
            {id: 1, name: 'Largo', bpm: 60, category: 'classical', description: 'Широко, медленно'},
            {id: 2, name: 'Adagio', bpm: 72, category: 'classical', description: 'Спокойно, медленно'},
            {id: 3, name: 'Andante', bpm: 88, category: 'classical', description: 'Размеренно, не спеша'},
            {id: 4, name: 'Moderato', bpm: 112, category: 'classical', description: 'Умеренно'},
            {id: 5, name: 'Allegro', bpm: 140, category: 'classical', description: 'Быстро, оживленно'},
            {id: 6, name: 'Presto', bpm: 180, category: 'classical', description: 'Очень быстро'},
            {id: 7, name: 'Rock Ballad', bpm: 70, category: 'rock', description: 'Медленный рок'},
            {id: 8, name: 'Rock Standard', bpm: 120, category: 'rock', description: 'Стандартный рок'},
            {id: 9, name: 'Hard Rock', bpm: 140, category: 'rock', description: 'Быстрый рок'},
            {id: 10, name: 'Slow Jazz', bpm: 90, category: 'jazz', description: 'Медленный джаз'},
            {id: 11, name: 'Medium Jazz', bpm: 130, category: 'jazz', description: 'Средний темп'},
            {id: 12, name: 'Upbeat Jazz', bpm: 180, category: 'jazz', description: 'Быстрый джаз'},
            {id: 13, name: 'Hip-Hop', bpm: 85, category: 'popular', description: 'Хип-хоп бит'},
            {id: 14, name: 'Pop', bpm: 120, category: 'popular', description: 'Поп-музыка'},
            {id: 15, name: 'Dance', bpm: 128, category: 'popular', description: 'Танцевальная'},
            {id: 16, name: 'Techno', bpm: 135, category: 'electronic', description: 'Техно'},
            {id: 17, name: 'House', bpm: 125, category: 'electronic', description: 'Хаус'},
            {id: 18, name: 'Dubstep', bpm: 140, category: 'electronic', description: 'Дабстеп'}
        ];
    }

    setupEventListeners() {
        // Обработчики категорий
        // document.querySelectorAll('.preset-category-btn').forEach(btn => {
        //    btn.addEventListener('click', (e) => {
        //        const category = e.target.dataset.category;
        //        this.filterPresets(category);

        //        // Обновляем активную кнопку
        //        document.querySelectorAll('.preset-category-btn').forEach(b => b.classList.remove('active'));
        //        e.target.classList.add('active');
        //    });
        //});
        // Обработчик выпадающего списка
        const presetsDropdown = document.getElementById('presets-dropdown');
        const applyPresetBtn = document.getElementById('apply-preset');

        if (presetsDropdown && applyPresetBtn) {
            applyPresetBtn.addEventListener('click', () => {
                const selectedBpm = parseInt(presetsDropdown.value);
                if (selectedBpm) {
                    this.applyPreset({
                        bpm: selectedBpm,
                        name: presetsDropdown.options[presetsDropdown.selectedIndex].text
                    });
                }
            });

            // Автоприменение при выборе (опционально)
            presetsDropdown.addEventListener('change', (e) => {
                if (e.target.value) {
                    const selectedBpm = parseInt(e.target.value);
                    this.applyPreset({
                        bpm: selectedBpm,
                        name: e.target.option[e.target.selectedIndex].text
                    });
                }
            });
        }

    }

    // filterPresets(category) {
    //     const container = document.getElementById('presets-container');
    //     const filteredPresets = category === 'all'
    //         ? this.presets
    //         : this.presets.filter(preset => preset.category === category);
    //
    //     this.renderPresets(filteredPresets);
    // }
    //
    // renderPresets(presets = this.presets) {
    //     const container = document.getElementById('presets-container');
    //
    //     container.innerHTML = presets.map(preset => `
    //         <div class="preset-card ${this.currentPreset?.id === preset.id ? 'active' : ''}"
    //             data-id="${preset.id}" data-bpm="${preset.bpm}">
    //             <div class="preset-name">${preset.name}</div>
    //             <div class="preset-bpm">${preset.bpm}</div>
    //             <div class="preset-description">${preset.description}</div>
    //         </div>
    //     `).join('');
    //
    //     // Добавляем обработчики для карточек пресетов
    //     container.querySelectorAll('.preset-card').forEach(card => {
    //         card.addEventListener('click', (e) =>{
    //             const presetId = parseInt(e.currentTarget.dataset.id);
    //             const preset = this.presets.find(p => p.id === presetId);
    //             if (preset) {
    //                 this.applyPreset(preset);
    //             }
    //         });
    //     });
    // }

    applyPreset(preset) {
        // Обновляем BPM в метрономе
        this.metronome.updateBpm(preset.bpm);

        // Обновляем поле ввода
        const bpmField = document.querySelector('[name="bpm"]') || document.getElementById('id_bpm');
        if (bpmField) {
            bpmField.value = preset.bpm;
        }

        // Обновляем отображение BPM
        const currentBpmDisplay = document.getElementById('current-bpm');
        if (currentBpmDisplay) {
            currentBpmDisplay.textContent = preset.bpm;
        }

        // Обновляем активный пресет
        // this.currentPreset = preset;
        // this.renderPresets(); // Перерисовываем для активного обновления

        // Показываем уведомление
        this.showNotification(`Установлен пресет: ${preset.name} (${preset.bpm} BPM)`);

        // Отправляем событие для обновления описания темпа
        const event = new CustomEvent('bpmChanged', { detail: { bpm: preset.bpm } });
        document.dispatchEvent(event);
    }

    showNotification(message) {
        // Создаём временное уведомление
        const notification = document.createElement('div')
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}