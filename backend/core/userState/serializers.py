from rest_framework import serializers
from .models import UserState

class UserStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserState
        fields = ['id', 'user', 'state', 'updated_at']