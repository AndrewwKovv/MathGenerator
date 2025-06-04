from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Notification, Log

User = get_user_model()


class NotificationModelTest(TestCase):
    def setUp(self):
        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            email="testuser@example.com",
            full_name="testuser",
            password="password123"
        )

        # Создаем тестовое уведомление
        self.notification = Notification.objects.create(
            user=self.user,
            message="Это тестовое уведомление",
            is_read=False
        )

    def test_notification_creation(self):
        """Тестирование создания уведомления"""
        self.assertEqual(self.notification.user, self.user)
        self.assertEqual(self.notification.message, "Это тестовое уведомление")
        self.assertFalse(self.notification.is_read)

    def test_mark_notification_as_read(self):
        """Тестирование пометки уведомления как прочитанного"""
        self.notification.is_read = True
        self.notification.save()
        self.assertTrue(self.notification.is_read)

    def test_notification_str_representation(self):
        """Тестирование строкового представления уведомления"""
        self.assertEqual(
            str(self.notification),
            f"Уведомление для {self.user.full_name} от Системы"
        )