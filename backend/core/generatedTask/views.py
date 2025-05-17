from rest_framework import viewsets
from .models import GeneratedTask
from .serializers import GeneratedTaskSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

class GeneratedTaskViewSet(viewsets.ModelViewSet):
    queryset = GeneratedTask.objects.all()
    serializer_class = GeneratedTaskSerializer

    def perform_create(self, serializer):
        # Устанавливаем текущего пользователя как создателя варианта
        serializer.save(creator=self.request.user)

    @action(detail=False, methods=['get'], url_path='by-hash')
    def get_by_hash(self, request):
        """
        Получение варианта по hash_code.
        """
        hash_code = request.query_params.get('hash')
        if not hash_code:
            return Response({'error': 'Параметр hash обязателен'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            generated_task = GeneratedTask.objects.get(hash_code=hash_code)
            serializer = self.get_serializer(generated_task)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GeneratedTask.DoesNotExist:
            return Response({'error': 'Вариант с указанным hash не найден'}, status=status.HTTP_404_NOT_FOUND)