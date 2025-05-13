from django.contrib import admin
from .models import TaskAnswer, Answer, AnonymousSolution


@admin.register(TaskAnswer)
class TaskAnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'answer_text')
    list_display_links = ('id', 'task')
    search_fields = ('task__title', 'answer_text')
    list_filter = ('task',)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'generated_task', 'anonymous_solution')
    list_display_links = ('id', 'user')
    search_fields = ('user__full_name', 'generated_task__hash_code', 'anonymous_solution__full_name')
    list_filter = ('generated_task',)


@admin.register(AnonymousSolution)
class AnonymousSolutionAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'created_at')
    list_display_links = ('id', 'full_name')
    search_fields = ('full_name', 'solution')
    list_filter = ('created_at',)