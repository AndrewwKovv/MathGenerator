from rest_framework import serializers
from tasks.serializers import TopicSerializer, TaskSerializer
from authentication.serializers import UserSerializer
from .models import GeneratedTask

class GeneratedTaskSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    recipients = UserSerializer(many=True, read_only=True)
    topic = TopicSerializer(read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = GeneratedTask
        fields = [
            'id', 'hash_code', 'creator', 'recipients', 'topic', 'tasks'
        ]