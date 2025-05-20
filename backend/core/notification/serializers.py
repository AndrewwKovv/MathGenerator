from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)  # Отображение отправителя
    user = serializers.StringRelatedField(read_only=True)  # Отображение получателя

    class Meta:
        model = Notification
        fields = ['id', 'sender', 'user', 'message', 'is_read', 'created_at']