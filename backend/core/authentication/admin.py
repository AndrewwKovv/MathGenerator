from django.contrib import admin
from authentication.models import User, Group, TaskStatus
# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('id','email', 'full_name', 'password',)
    list_display_links = ('id','email',)
    search_fields = ('id', 'email','full_name',)

class GroupAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'created_at')
    list_display_links = ('id','name')
    search_fields = ('id','name',)

class TaskStatusAdmin(admin.ModelAdmin):
    list_display = ('id','status')
    list_display_links = ('id',)
    search_fields = ('id','status')
    list_editable = ('status' ,)
    list_filter = ('status',)



admin.site.register(TaskStatus, TaskStatusAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(User, UserAdmin)