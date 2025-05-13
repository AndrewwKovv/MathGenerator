from django.contrib import admin
from tasks.models import Task, Topic

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'view', 'template')  # Указаны существующие поля
    list_display_links = ('id', 'title')
    search_fields = ('title', 'view')
    list_filter = ('title',)

class TopicAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'section_name')  # Указаны существующие поля модели Topic
    list_display_links = ('id', 'name')
    search_fields = ('name', 'section_name')
    list_filter = ('section_name',)

admin.site.register(Task, TaskAdmin)
admin.site.register(Topic, TopicAdmin)