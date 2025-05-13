from django.db import models
from authentication.models import User

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    message = models.TextField(verbose_name='Сообщение')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return f"Уведомление для {self.user.full_name}"

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'