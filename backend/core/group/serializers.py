from rest_framework import serializers
from authentication.serializers import UserSerializer
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    students = UserSerializer(many=True, read_only=True)
    teachers = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'students', 'teachers']