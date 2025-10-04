from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class UserSettings(models.Model):
    BEAT_UNIT_CHOICES = [
        (2, '1/2'),
        (4, '1/4'),
        (8, '1/8'),
        (16, '1/16'),
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
