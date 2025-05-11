from rest_framework import serializers
from tasks.serializers import TaskSerializer
from .models import GeneratedTask

class GeneratedTaskSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)  # Включаем связанные задания

    class Meta:
        model = GeneratedTask
        fields = ['id', 'created_at', 'update_at', 'code', 'title', 'tempalates_ids', 'tasks']