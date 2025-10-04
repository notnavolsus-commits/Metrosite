from django.contrib import admin

from .models import UserSettings

@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ['beats_per_measure', 'beat_unit', 'bpm', 'volume']
    list_filter = ['beat_unit', 'bpm']
