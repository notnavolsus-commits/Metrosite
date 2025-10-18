from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import PositiveIntegerField


class UserSettings(models.Model):
    BEAT_UNIT_CHOICES = [
        (2, '2'),
        (4, '4'),
        (8, '8'),
        (16, '16'),
    ]
    beats_per_measure = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(16)])
    beat_unit = models.PositiveIntegerField(choices=BEAT_UNIT_CHOICES)

    volume = models.PositiveIntegerField(
        default=70,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Громкость в процентах (0-100)"
    )

    bpm = models.PositiveIntegerField(
        default=120,
        validators=[MinValueValidator(30), MaxValueValidator(300)],
        help_text="Ударов в минуту (30-300 BPM)"
    )

class TempoPreset(models.Model):
    name = models.CharField(max_length=100, help_text="Название пресета")
    bpm = models.PositiveIntegerField(
        validators=[MinValueValidator(30), MaxValueValidator(300)],
        help_text="Темп в BPM"
    )
    description = models.CharField(max_length=200, blank=True, help_text="Описание")
    category = models.CharField(
        max_length=20,
        choices=[
            ('classical', 'Классика'),
            ('popular', 'Популярная музыка'),
            ('rock', 'Рок'),
            ('jazz', 'Джаз'),
            ('electronic', 'Электронная'),
            ('custom', 'Пользовательская')
        ],
    default='custom'
    )

    def __str__(self):
        return f"{self.name} ({self.bpm} BPM)"

    class Meta:
        ordering = ['bpm']

class BeatSound(models.Model):
    SOUND_CHOICES = [
        ('click', 'Клик'),
        ('beep', 'Бип'),
        ('woodblock', 'Вудблок'),
        ('drum', 'Барабан'),
        ('bell', 'Колокольчик'),
        ('triangle', 'Треугольник'),
        ('cowbell', 'Ковбелл'),
        ('tambourine', 'Бубен'),
    ]

    user_settings = models.ForeignKey(UserSettings, on_delete=models.CASCADE, related_name='beat_sounds')
    beat_position = models.PositiveIntegerField(help_text="Позиция доли (0 - сильная доля)")
    sound_type = models.CharField(max_length=20, choices=SOUND_CHOICES, default='click')
    volume = models.PositiveIntegerField(
        default=100,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Громкость этой доли (%)"
    )

    class Meta:
        unique_together = ['user_settings', 'beat_position']
        ordering = ['beat_position']

    def __str__(self):
        return f"Доля {self.beat_position}: {self.get_sound_type_display}"
