from rest_framework import serializers
from .models import Answer
from generatedTask.models import GeneratedTask
from generatedTask.serializers import GeneratedTaskSerializer


class AnswerSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Отображение информации о пользователе
    generated_task = GeneratedTaskSerializer(read_only=True)  # Полные данные о варианте
    generated_task_id = serializers.PrimaryKeyRelatedField(
        queryset=GeneratedTask.objects.all(),
        write_only=True,
        source='generated_task'
    )  # Для создания ответа по ID варианта

    class Meta:
        model = Answer
        fields = [
            'id', 'user', 'full_name', 'generated_task', 'generated_task_id',
            'task_answers', 'created_at', 'generated_task_hash'
        ]
        read_only_fields = ['id', 'created_at', 'generated_task_hash']