from rest_framework import serializers
from tasks.serializers import TopicSerializer, TaskSerializer
from authentication.serializers import SimpleUserSerializer
from .models import GeneratedTask

class GeneratedTaskSerializer(serializers.ModelSerializer):
    creator = SimpleUserSerializer(read_only=True)
    recipients = SimpleUserSerializer(many=True, read_only=True)
    topic = TopicSerializer(read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = GeneratedTask
        fields = [
            'id','title', 'hash_code', 'creator', 'recipients', 'topic', 'tasks', 'training_key'
        ]
