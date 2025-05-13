from django.contrib import admin
from generatedTask.models import GeneratedTask

class GeneratedTaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'hash_code', 'creator', 'topic')  # Указаны существующие поля
    list_display_links = ('id', 'hash_code')
    search_fields = ('hash_code', 'creator__full_name', 'topic__name')
    list_filter = ('topic',)

admin.site.register(GeneratedTask, GeneratedTaskAdmin)