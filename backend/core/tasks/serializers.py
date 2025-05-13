from rest_framework import serializers
from .models import Task, Topic

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name', 'section_name']

class TaskSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'view', 'template', 'topics']