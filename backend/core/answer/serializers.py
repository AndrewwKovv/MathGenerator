from rest_framework import serializers
from .models import TaskAnswer, Answer, AnonymousSolution
from tasks.serializers import TaskSerializer
from authentication.serializers import UserSerializer
from generatedTask.serializers import GeneratedTaskSerializer


class TaskAnswerSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)  # Отображение информации о задании

    class Meta:
        model = TaskAnswer
        fields = ['id', 'task', 'answer_text']

class AnonymousSolutionSerializer(serializers.ModelSerializer):
    generated_task = GeneratedTaskSerializer(read_only=True)  # Отображение информации о варианте
    task_answers = TaskAnswerSerializer(many=True, read_only=True)  # Отображение ответов на задания

    class Meta:
        model = AnonymousSolution
        fields = ['id', 'full_name', 'generated_task', 'task_answers', 'created_at']

class AnswerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Отображение информации о пользователе
    generated_task = GeneratedTaskSerializer(read_only=True)  # Отображение информации о варианте
    task_answers = TaskAnswerSerializer(many=True, read_only=True)  # Отображение ответов на задания

    class Meta:
        model = Answer
        fields = ['id', 'user', 'generated_task', 'task_answers']