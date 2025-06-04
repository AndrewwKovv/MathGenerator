from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Answer
from generatedTask.models import GeneratedTask
from tasks.models import Task, Topic

User = get_user_model()


class AnswerModelTest(TestCase):
    def setUp(self):
        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            email="testuser@example.com",
            full_name="testuser",
            password="password123"
        )

        # Создаем тестовый объект Topic
        self.topic = Topic.objects.create(
            name="Интегралы",
            section_name="Математический анализ"
        )

        # Создаем тестовый объект Task
        self.task = Task.objects.create(
            title="Метод замены переменной",
            view=r"\int{f(g(x))g'(x)}dx",
            data_task=r"\int{sin(4x)}dx"
        )
        # Добавляем связь между Task и Topic
        self.task.topics.add(self.topic)

        # Создаем тестовый объект GeneratedTask
        self.generated_task = GeneratedTask.objects.create(
            title="Вариант 1",
            hash_code="abc123",
            creator=self.user
        )
        self.generated_task.tasks.add(self.task)

        # Создаем тестовый объект Answer
        self.answer = Answer.objects.create(
            user=self.user,
            generated_task=self.generated_task,
            task_answers=[
                {"taskId": self.task.id, "answerText": "cos(4x)/4"}
            ]
        )

    def test_answer_creation(self):
        """Тестирование создания объекта Answer"""
        self.assertEqual(self.answer.user, self.user)
        self.assertEqual(self.answer.generated_task, self.generated_task)
        self.assertEqual(len(self.answer.task_answers), 1)
        self.assertEqual(self.answer.task_answers[0]["answerText"], "cos(4x)/4")

    def test_answer_str_representation(self):
        """Тестирование строкового представления объекта Answer"""
        self.assertEqual(
            str(self.answer),
            f"Ответ от {self.user.full_name} на {self.generated_task.hash_code}"
        )

    def test_answer_deletion(self):
        """Тестирование удаления объекта Answer"""
        answer_id = self.answer.id
        self.answer.delete()
        self.assertFalse(Answer.objects.filter(id=answer_id).exists())