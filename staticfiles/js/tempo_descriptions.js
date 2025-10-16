class TempoDescription {
    constructor() {
        this.tempoRanges = [
            {
                name: 'Larghissimo',
                bpmRange: '20 и ниже',
                minBpm: 0,
                maxBpm: 20,
                description: 'Очень, очень медленно'
            },
            {
                name: 'Grave',
                bpmRange: '20-40 BPM',
                minBpm: 20,
                maxBpm: 40,
                description: 'Медленно, протяжно, важно'
            },
            {
                name: 'Lento',
                bpmRange: '40-50 BPM',
                minBpm: 40,
                maxBpm: 50,
                description: 'Протяжно, медленно'
            },
            {
                name: 'Largo',
                bpmRange: '50-60 BPM',
                minBpm: 50,
                maxBpm: 60,
                description: 'Медленно'
            },
            {
                name: 'Larghetto',
                bpmRange: '60-66 BPM',
                minBpm: 60,
                maxBpm: 66,
                description: 'Довольно медленно'
            },
            {
                name: 'Adagio',
                bpmRange: '66-76 BPM',
                minBpm: 66,
                maxBpm: 76,
                description: 'Неспешно, протяжно'
            },
            {
                name: 'Adagietto',
                bpmRange: '70-80 BPM',
                minBpm: 70,
                maxBpm: 80,
                description: 'Относительно медленно'
            },
            {
                name: 'Andante',
                bpmRange: '80-108',
                minBpm: 80,
                maxBpm: 108,
                description: 'В темпе ходьбы, плавно'
            },
            {
                name: 'Moderato',
                bpmRange: '108-115 BPM',
                minBpm: 108,
                maxBpm: 115,
                description: 'Умеренно'
            },
            {
                name: 'Allegro moderato',
                bpmRange: '120-124 BPM',
                minBpm: 115,
                maxBpm: 124,
                description: 'Умеренно скоро'
            },
            {
                name: 'Allegro',
                bpmRange: '124-168',
                minBpm: 124,
                maxBpm: 168,
                description: 'Быстро'
            },
            {
                name: 'Vivace',
                bpmRange: '168-176 BPM',
                minBpm: 168,
                maxBpm: 176,
                description: 'Живо, быстро'
            },
            {
                name: 'Presto',
                bpmRange: '176-200 BPM',
                minBpm: 176,
                maxBpm: 200,
                description: 'Очень быстро'
            },
            {
                name: 'Prestissimo',
                bpmRange: '200+ BPM',
                minBpm: 200,
                maxBpm: 999,
                description: 'Очень быстро'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Следим за изменениями BPM
        const bpmField = document.querySelector('[name="bpm"]') || document.getElementById('id_bpm');
        if (bpmField) {
            bpmField.addEventListener('input', (e) => {
                const bpm = parseInt(e.target.value) || 120;
                this.updateTempoDescription(bpm);
            });

            // Инициализируем при загрузке
            const initialBpm = parseInt(bpmField.value) || 120;
            this.updateTempoDescription(initialBpm);
        }

        // Также обновляем при изменении через другие элементы
        document.addEventListener('bpmChanged', (e) => {
            this.updateTempoDescription(e.detail.bpm);
        });
    }

    getTempoDescription(bpm) {
        for (const tempo of this.tempoRanges) {
            if (bpm >= tempo.minBpm && bpm <= tempo.maxBpm) {
                return tempo;
            }
        }

        // Если не нашли возвращаем ближайший
        return this.tempoRanges.find(t => bpm <=t.maxBpm) || this.tempoRanges[this.tempoRanges.length - 1];
    }

    updateTempoDescription(bpm) {
        const tempoInfo = this.getTempoDescription(bpm);
        this.renderTempoDescription(tempoInfo, bpm);
    }

    renderTempoDescription(tempoInfo, currentBpm) {
        let container = document.getElementById('tempo-description');

        // Создаём контейнер, если его нет
        if (!container) {
            container = document.createElement('div');
            container.id = 'tempo-description';
            container.className = 'tempo-description';

            // Вставляем после BPM дисплея
            const bpmDisplay = document.querySelector('.bpm-display');
            if (bpmDisplay) {
                bpmDisplay.parentNode.insertBefore(container, bpmDisplay.nextSibling);
            }
        }

        const isInRange = currentBpm >= tempoInfo.minBpm && currentBpm <= tempoInfo.maxBpm;
        const rangeClass = isInRange ? 'in-range' : 'out-of-range';

        container.innerHTML = `
            <div class="tempo-info ${rangeClass}">
                <span class="tempo-name">${tempoInfo.name}</span>
                <span class="tempo-range">${tempoInfo.bpmRange}</span>
                <div class="tempo-description-text"${tempoInfo.description}</div>
                ${!isInRange ? `<div class="tempo-warning">Текущий BPM (${currentBpm}) вне типичного диапазона</div>` : ''}
            </div>
        `;
    }

    // Метод для получения описания
    static getDescription(bpm) {
        const instance = new TempoDescription();
        return instance.getTempoDescription(bpm);
    }
}