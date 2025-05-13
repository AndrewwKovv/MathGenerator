from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny

from tasks.models import Task
from generatedTask.models import GeneratedTask
from .models import TaskAnswer, Answer, AnonymousSolution
from .serializers import TaskAnswerSerializer, AnswerSerializer, AnonymousSolutionSerializer


class TaskAnswerViewSet(viewsets.ModelViewSet):
    queryset = TaskAnswer.objects.all()
    serializer_class = TaskAnswerSerializer
    permission_classes = [IsAuthenticated]

class AnonymousSolutionViewSet(viewsets.ModelViewSet):
    queryset = AnonymousSolution.objects.all()
    serializer_class = AnonymousSolutionSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Устанавливаем текущего пользователя как автора ответа
        serializer.save(user=self.request.user)

    @action(methods=['POST'], detail=False, url_path='submit-anonymous-solution', permission_classes=[AllowAny])
    def submit_anonymous_solution(self, request):
        """
        Обработка анонимного решения.
        """
        generated_task_id = request.data.get('generated_task_id')
        full_name = request.data.get('full_name')
        task_answers_data = request.data.get('task_answers')  # Список ответов на задания

        if not generated_task_id or not full_name or not task_answers_data:
            return Response({'error': 'ID варианта, ФИО и ответы обязательны'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            generated_task = GeneratedTask.objects.get(id=generated_task_id)
        except GeneratedTask.DoesNotExist:
            return Response({'error': 'Вариант не найден'}, status=status.HTTP_404_NOT_FOUND)

        # Создаем анонимное решение
        anonymous_solution = AnonymousSolution.objects.create(
            full_name=full_name,
            generated_task=generated_task
        )

        # Создаем ответы на задания и связываем их с анонимным решением
        for task_answer_data in task_answers_data:
            task_id = task_answer_data.get('task_id')
            answer_text = task_answer_data.get('answer_text')

            if not task_id or not answer_text:
                return Response({'error': 'ID задания и текст ответа обязательны'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return Response({'error': f'Задание с ID {task_id} не найдено'}, status=status.HTTP_404_NOT_FOUND)

            task_answer = TaskAnswer.objects.create(task=task, answer_text=answer_text)
            anonymous_solution.task_answers.add(task_answer)

        return Response({'message': 'Анонимное решение успешно отправлено', 'solution_id': anonymous_solution.id}, status=status.HTTP_201_CREATED)