from django.db import models
from authentication.models import User

class Log(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    action = models.CharField(max_length=255, verbose_name='Действие')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Время действия', null=True, blank=True)

    def __str__(self):
        return f"{self.user.full_name} - {self.action}"

    class Meta:
        verbose_name = 'Лог действия'
        verbose_name_plural = 'Логи действий'