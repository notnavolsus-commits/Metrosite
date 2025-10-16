from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import UserSettings, TempoPreset
from .forms import UserSettingsForm
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def metronome_view(request):
    #Получить или создать настройки
    try:
        settings = UserSettings.objects.first()
        if not settings:
            settings = UserSettings.objects.create(
                beats_per_measure=4,
                beat_unit=4,
                bpm=120,
                volume=70
            )
    except:
        settings = UserSettings.objects.create(
            beats_per_measure=4,
            beat_unit=4,
            bpm=120,
            volume=70
        )

    # Обработка Form submit (POST)
    if request.method == 'POST':
        # Если нажали "Сохранить":
        if 'save_settings' in request.POST:
            form = UserSettingsForm(request.POST, instance=settings)
            if form.is_valid():
                form.save()
                return redirect('metronome') #Обновить страницу

    elif 'toggle_play' in request.POST:
        is_playing = request.POST.get('is_playing') == 'true'
        # логика управления звуком метронома

    # Подготовить данные для шаблона
    else:
        form = UserSettingsForm(instance=settings)

    # вернуть шаблон с данными
    context = {
        'settings': settings,
        'form': form,
        'beats': range(settings.beats_per_measure),
        # дополнительные данные для шаблона
    }
    return render(request, 'metronome/index.html', context)

def api_presets(request):
    presets = TempoPreset.objects.all().values('id', 'name', 'bpm', 'category', 'description')
    return JsonResponse(list(presets), safe=False)
