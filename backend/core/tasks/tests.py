from django.test import TestCase
from .models import Topic

class TopicModelTest(TestCase):
    def setUp(self):
        # Создаем тестовый объект Topic
        self.topic = Topic.objects.create(
            name="matrixs",
            section_name="Матрицы"
        )

    def test_topic_creation(self):
        """Тестирование создания объекта Topic"""
        self.assertEqual(self.topic.name, "matrixs")
        self.assertEqual(self.topic.section_name, "Матрицы")
        self.assertEqual(str(self.topic), "matrixs")  # Проверка метода __str__

    def test_topic_update(self):
        """Тестирование обновления объекта Topic"""
        self.topic.name = "algebra"
        self.topic.save()
        self.assertEqual(self.topic.name, "algebra")

    def test_topic_deletion(self):
        """Тестирование удаления объекта Topic"""
        topic_id = self.topic.id
        self.topic.delete()
        self.assertFalse(Topic.objects.filter(id=topic_id).exists())