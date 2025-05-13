from django.db import models

class TaskStatus(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Выполнено'),
        ('in_progress', 'В процессе'),
        ('not_started', 'Не начато'),
    ]

    generated_task = models.ForeignKey(
        'generatedTask.GeneratedTask',
        on_delete=models.CASCADE,
        null=True,
        verbose_name='Вариант'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        null=True,
        verbose_name='Пользователь'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Дата завершения')
    time_spent = models.DurationField(null=True, blank=True, verbose_name='Время выполнения')

    def __str__(self):
        return f"{self.user.full_name} - {self.generated_task.hash_code}"

    class Meta:
        verbose_name = 'Статус задания'
        verbose_name_plural = 'Статусы заданий'