from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import NotFound

from tasks.models import Task
from generatedTask.models import GeneratedTask
from .models import Answer
from .serializers import AnswerSerializer


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def perform_create(self, serializer):
        """
        Создание ответа для авторизованного или анонимного пользователя.
        """
        generated_task_id = self.request.data.get('generated_task_id')
        full_name = self.request.data.get('full_name')  # ФИО для анонимных пользователей
        task_answers = self.request.data.get('task_answers')  # Ответы на задания

        if not generated_task_id or not task_answers:
            raise serializers.ValidationError({'error': 'ID варианта и ответы обязательны'})

        try:
            generated_task = GeneratedTask.objects.get(id=generated_task_id)
        except GeneratedTask.DoesNotExist:
            raise serializers.ValidationError({'error': 'Указанный вариант не найден'})

        if self.request.user.is_authenticated:
            # Создаем ответ для авторизованного пользователя
            serializer.save(user=self.request.user, generated_task=generated_task, task_answers=task_answers)
        else:
            # Создаем ответ для анонимного пользователя
            if not full_name:
                raise serializers.ValidationError({'error': 'ФИО обязательно для анонимного решения'})
            serializer.save(full_name=full_name, generated_task=generated_task, task_answers=task_answers)

    @action(detail=False, methods=['get'], url_path='my-answers', permission_classes=[IsAuthenticated])
    def get_my_answers(self, request):
        """
        Получение решений текущего авторизованного пользователя.
        """
        answers = Answer.objects.filter(user=request.user)
        serializer = self.get_serializer(answers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['POST'], detail=False, url_path='submit-solution', permission_classes=[AllowAny])
    def submit_solution(self, request):
        """
        Обработка решения (авторизованного или анонимного).
        """
        generated_task_id = request.data.get('generatedTaskId')  # ID варианта
        task_answers = request.data.get('taskAnswers')  # Ответы на задания
        full_name = request.data.get('fullName')  # ФИО для анонимных пользователей
    
        # Проверяем обязательные поля
        if not generated_task_id or not task_answers:
            return Response({'error': 'ID варианта и ответы обязательны'}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            # Ищем вариант по ID
            generated_task = GeneratedTask.objects.get(id=generated_task_id)
        except GeneratedTask.DoesNotExist:
            return Response({'error': 'Вариант не найден'}, status=status.HTTP_404_NOT_FOUND)
    
        # Создаем объект Answer
        if request.user.is_authenticated:
            # Для авторизованного пользователя
            answer = Answer.objects.create(
                user=request.user,
                generated_task=generated_task,
                task_answers=task_answers
            )
        else:
            # Для анонимного пользователя
            if not full_name:
                return Response({'error': 'ФИО обязательно для анонимного решения'}, status=status.HTTP_400_BAD_REQUEST)
            answer = Answer.objects.create(
                full_name=full_name,
                generated_task=generated_task,
                task_answers=task_answers
            )
    
        return Response({'message': 'Решение успешно отправлено', 'answer_id': answer.id}, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=['get'],
        url_path='solution-by-hash',
        permission_classes=[AllowAny],
    )
    def get_solution_by_hash(self, request):
        hash_code = request.query_params.get('hash_code')
        user_id = request.query_params.get('user_id')

        if not hash_code or not user_id:
            return Response(
                {'error': 'Параметры hash_code и user_id обязательны'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            generated_tasks = GeneratedTask.objects.filter(hash_code=hash_code)
            if not generated_tasks.exists():
                raise NotFound('Вариант с указанным hash_code не найден')

            answer = Answer.objects.filter(generated_task__in=generated_tasks, user_id=user_id).first()
            if not answer:
                raise NotFound('Решение для указанного пользователя не найдено')

            serializer = AnswerSerializer(answer)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except NotFound as nf:
            return Response({'error': str(nf)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Ошибка сервера: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)