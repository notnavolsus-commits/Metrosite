from django.contrib import admin

from .models import UserSettings
from .models import TempoPreset

@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ['beats_per_measure', 'beat_unit', 'bpm', 'volume']
    list_filter = ['beat_unit', 'bpm']

@admin.register(TempoPreset)
class TempoPresetAdmin(admin.ModelAdmin):
    list_display = ['name', 'bpm', 'category', 'description']
    list_filter = ['category']
    search_fields = ['name', 'description']