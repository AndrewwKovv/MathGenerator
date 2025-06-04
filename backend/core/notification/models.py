from django.db import models
from authentication.models import User

class Notification(models.Model):
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_notifications',
        verbose_name='Отправитель'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_notifications',
        verbose_name='Получатель'
    )
    message = models.TextField(verbose_name='Сообщение')
    is_read = models.BooleanField(default=False, verbose_name='Прочитано')  # Флаг прочитанности
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания', null=True, blank=True)

    def __str__(self):
        return f"Уведомление для {self.user.full_name} от {self.sender.full_name if self.sender else 'Системы'}"

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'

class Log(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    action = models.CharField(max_length=255, verbose_name='Действие')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Время действия', null=True, blank=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.action}"

    class Meta:
        verbose_name = 'Лог действия'
        verbose_name_plural = 'Логи действий'