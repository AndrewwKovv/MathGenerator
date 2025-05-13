from rest_framework import serializers
from generatedTask.serializers import GeneratedTaskSerializer
from authentication.serializers import UserSerializer
from .models import TaskStatus

class TaskStatusSerializer(serializers.ModelSerializer):
    generated_task = GeneratedTaskSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = TaskStatus
        fields = ['id', 'generated_task', 'user', 'status', 'completed_at', 'time_spent']