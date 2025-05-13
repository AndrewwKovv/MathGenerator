from django.db import models
from authentication.models import User

class UserState(models.Model):
    STATE_CHOICES = [
        ('active', 'Активен'),
        ('inactive', 'Неактивен'),
        ('banned', 'Заблокирован'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='active', verbose_name='Состояние')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')

    def __str__(self):
        return f"{self.user.full_name} - {self.state}"

    class Meta:
        verbose_name = 'Состояние пользователя'
        verbose_name_plural = 'Состояния пользователей'