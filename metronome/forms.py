from django import forms
from .models import UserSettings

class UserSettingsForm(forms.ModelForm):
    class Meta:
        model = UserSettings
        fields = ['beats_per_measure', 'beat_unit', 'bpm', 'volume']