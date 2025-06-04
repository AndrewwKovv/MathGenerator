from rest_framework import serializers
from .models import User, Group, TaskStatus
from generatedTask.models import GeneratedTask
from answer.models import Answer

# Упрощенный сериализатор для User
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name']

# Упрощенный сериализатор для GeneratedTask
class SimpleGeneratedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedTask
        fields = ['id', 'hash_code']

# Полный сериализатор для User
class UserSerializer(serializers.ModelSerializer):
    group = serializers.SerializerMethodField(read_only=True)  # Для студентов
    groups = serializers.SerializerMethodField(read_only=True)  # Для преподавателей
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

    def get_group(self, obj):
        if obj.group:
            return {"id": obj.group.id, "name": obj.group.name}
        return None

    def get_groups(self, obj):
        return [{"id": group.id, "name": group.name} for group in obj.groups.all()]

# Полный сериализатор для Group
class GroupSerializer(serializers.ModelSerializer):
    students = SimpleUserSerializer(many=True, read_only=True)  # Используем упрощенный сериализатор
    teachers = SimpleUserSerializer(many=True, read_only=True)  # Используем упрощенный сериализатор

    class Meta:
        model = Group
        fields = ['id', 'name', 'students', 'teachers']

# Полный сериализатор для TaskStatus
class TaskStatusSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)  # Используем упрощенный сериализатор
    generated_task = serializers.SerializerMethodField()

    class Meta:
        model = TaskStatus
        fields = ['id', 'generated_task', 'user', 'status', 'completed_at', 'time_spent']

    def get_generated_task(self, obj):
        if obj.generated_task:
            return SimpleGeneratedTaskSerializer(obj.generated_task, read_only=True).data
        return None