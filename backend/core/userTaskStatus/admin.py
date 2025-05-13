from django.contrib import admin
from userTaskStatus.models import TaskStatus
# Register your models here.
class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ('id','status')
    list_display_links = ('id',)
    search_fields = ('id','status')
    list_editable = ('status' ,)
    list_filter = ('status',)



admin.site.register(TaskStatus, TaskStatusAdmin)