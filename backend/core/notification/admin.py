from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'message', 'created_at')
    list_display_links = ('id', 'user')
    search_fields = ('user__full_name', 'message')
    list_filter = ('created_at',)