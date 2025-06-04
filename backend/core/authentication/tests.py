from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta, datetime
from .models import Group, TaskStatus

User = get_user_model()


class UserModelTest(TestCase):
    def setUp(self):
        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            email="testuser@example.com",
            full_name="testuser",
            password="password123"
        )

    def test_user_creation(self):
        """Тестирование создания пользователя"""
        self.assertEqual(self.user.full_name, "testuser")
        self.assertEqual(self.user.email, "testuser@example.com")
        self.assertTrue(self.user.check_password("password123"))

    def test_user_str_representation(self):
        """Тестирование строкового представления пользователя"""
        self.assertEqual(str(self.user), "testuser@example.com")


class GroupModelTest(TestCase):
    def setUp(self):
        # Создаем тестовую группу
        self.group = Group.objects.create(
            name="Группа 101"
        )

    def test_group_creation(self):
        """Тестирование создания группы"""
        self.assertEqual(self.group.name, "Группа 101")

    def test_group_str_representation(self):
        """Тестирование строкового представления группы"""
        self.assertEqual(str(self.group), "Группа 101")


class TaskStatusModelTest(TestCase):
    def setUp(self):
        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            email="testuser@example.com",
            full_name="testuser",
            password="password123"
        )

        # Создаем тестовый статус задания
        self.task_status = TaskStatus.objects.create(
            user=self.user,
            status="completed",
            time_spent=timedelta(hours=2),
        )

    def test_task_status_creation(self):
        """Тестирование создания статуса задания"""
        self.assertEqual(self.task_status.user, self.user)
        self.assertEqual(self.task_status.status, "completed")
        self.assertEqual(self.task_status.time_spent, timedelta(hours=2))

    def test_task_status_str_representation(self):
        """Тестирование строкового представления статуса задания"""
        self.assertEqual(
            str(self.task_status),
            f"{self.user.full_name} - Неизвестный вариант"
        )