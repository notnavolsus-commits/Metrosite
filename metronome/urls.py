from django.urls import path
from . import views

urlpatterns = [
    path('', views.metronome_view, name='metronome'),
    path('api/presets', views.api_presets, name='api_presets')
]