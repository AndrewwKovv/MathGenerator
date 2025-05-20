from rest_framework import serializers
from .models import Task, Topic

class TopicSerializerForTask(serializers.ModelSerializer):
    """Сериализатор для отображения тем в TaskSerializer."""
    class Meta:
        model = Topic
        fields = ['id', 'name', 'section_name']  # Только необходимые поля

class TaskSerializer(serializers.ModelSerializer):
    topics = TopicSerializerForTask(many=True, read_only=True)  # Используем упрощенный сериализатор для тем

    class Meta:
        model = Task
        fields = ['id', 'title', 'view','data_task' , 'topics']

class TopicSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)  # Полные данные о заданиях

    class Meta:
        model = Topic
        fields = ['id', 'name', 'section_name', 'tasks']