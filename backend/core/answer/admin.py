from django.contrib import admin
from .models import Answer


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'full_name', 'generated_task', 'created_at')  # Отображаем ключевые поля
    list_display_links = ('id', 'user', 'full_name')  # Делаем кликабельными ID, пользователя и ФИО
    search_fields = ('user__full_name', 'full_name', 'generated_task__hash_code')  # Поиск по пользователю, ФИО и hash варианта
    list_filter = ('generated_task', 'created_at')  # Фильтрация по варианту и дате создания
    readonly_fields = ('created_at', 'generated_task_hash')  # Поля только для чтения
    fieldsets = (
        (None, {
            'fields': ('user', 'full_name', 'generated_task', 'task_answers', 'created_at', 'generated_task_hash')
        }),
    )