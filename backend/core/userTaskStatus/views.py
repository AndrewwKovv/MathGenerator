from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TaskStatus
from .serializers import TaskStatusSerializer

class TaskStatusViewSet(viewsets.ModelViewSet):
    queryset = TaskStatus.objects.all()
    serializer_class = TaskStatusSerializer
    permission_classes = [IsAuthenticated]