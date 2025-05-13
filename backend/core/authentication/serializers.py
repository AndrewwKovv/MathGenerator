from rest_framework import serializers
from .models import User
from group.models import Group
from generatedTask.models import GeneratedTask
from userTaskStatus.models import TaskStatus
from answer.models import Answer


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    group = GroupSerializer(read_only=True)  # Для студентов
    groups = GroupSerializer(many=True, read_only=True)  # Для преподавателей
    task_status = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    generated_tasks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    answers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'password', 'email', 'full_name', 'group', 'groups', 
            'task_status', 'role', 'answers', 'generated_tasks', 'is_active'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }  # скрыть пароль

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        instance.is_active = True

        if password is not None:
            instance.set_password(password)
        instance.save()

        return instance