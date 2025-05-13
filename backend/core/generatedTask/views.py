from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import GeneratedTask
from .serializers import GeneratedTaskSerializer

class GeneratedTaskViewSet(viewsets.ModelViewSet):
    queryset = GeneratedTask.objects.all()
    serializer_class = GeneratedTaskSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Устанавливаем текущего пользователя как создателя варианта
        serializer.save(creator=self.request.user)