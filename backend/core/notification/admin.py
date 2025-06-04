from django.contrib import admin
from .models import Notification, Log

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'message', 'created_at')
    list_display_links = ('id', 'user')
    search_fields = ('user__full_name', 'message')
    list_filter = ('created_at',)

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'action', 'timestamp')
    list_display_links = ('id', 'user')
    search_fields = ('user__full_name', 'action')
    list_filter = ('timestamp',)