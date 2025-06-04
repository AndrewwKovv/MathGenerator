from django.db import models

class GeneratedTask(models.Model):
    title = models.CharField(max_length=255, verbose_name='Хеш-код варианта', null=True)
    hash_code = models.CharField(max_length=255, verbose_name='Хеш-код варианта', null=True)
    creator = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        null=True,
        related_name='created_tasks',
        verbose_name='Создатель'
    )
    recipients = models.ManyToManyField(
        'authentication.User',
        related_name='received_tasks',
        verbose_name='Получатели',
        blank=True
    )
    topic = models.ForeignKey(
        'tasks.Topic',
        on_delete=models.CASCADE,
        null=True,
        verbose_name='Тема'
    )
    tasks = models.ManyToManyField(
        'tasks.Task',
        related_name='generated_tasks',
        verbose_name='Задания',
        blank=True
    )
    training_key = models.CharField(max_length=255, verbose_name='Ключ тренировки', null=True, blank=True)

    def __str__(self):
        return self.hash_code

    class Meta:
        verbose_name = 'Вариант'
        verbose_name_plural = 'Варианты'