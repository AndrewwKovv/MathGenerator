from django.contrib import admin
from .models import Task, Topic

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'view', 'data_task')  # Отображаемые поля
    list_display_links = ('id', 'title')
    search_fields = ('title', 'view')
    list_filter = ('topics',)  # Фильтр по темам

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'section_name')  # Отображаемые поля
    list_display_links = ('id', 'name')
    search_fields = ('name', 'section_name')
    list_filter = ('section_name',)