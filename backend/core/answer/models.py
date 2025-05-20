from django.db import models
from django.db.models import JSONField  # Для хранения ответов в формате JSON


class Answer(models.Model):
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
        null=True,
        blank=True
    )
    full_name = models.CharField(
        max_length=255,
        verbose_name='ФИО',
        null=True,
        blank=True
    )
    generated_task = models.ForeignKey(
        'generatedTask.GeneratedTask',
        on_delete=models.CASCADE,
        verbose_name='Вариант',
        related_name='answers'
    )
    task_answers = JSONField(verbose_name='Ответы на задания', default=list)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания', null=True, blank=True)

    # Дополнительные поля для хранения данных варианта
    generated_task_hash = models.CharField(max_length=255, verbose_name='Hash варианта', null=True, blank=True)

    def save(self, *args, **kwargs):
        # Копируем данные из связанного варианта
        if self.generated_task:
            self.generated_task_hash = self.generated_task.hash_code
        super().save(*args, **kwargs)

    def __str__(self):
        if self.user:
            return f"Ответ от {self.user.full_name} на {self.generated_task_hash}"
        return f"Анонимное решение от {self.full_name} на {self.generated_task_hash}"

    class Meta:
        verbose_name = 'Ответ'
        verbose_name_plural = 'Ответы'