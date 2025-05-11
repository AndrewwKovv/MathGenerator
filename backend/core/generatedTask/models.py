from django.db import models
from templates.models import Templates
from tasks.models import Task

class GeneratedTask(models.Model):
    created_at = models.DateTimeField(verbose_name='время создания', auto_now_add=True)
    update_at = models.DateTimeField(verbose_name='время обновления', auto_now=True)
    code = models.TextField(verbose_name='Код варианта')
    title = models.CharField(verbose_name='Название варианта', max_length=255)
    tempalates_ids = models.ManyToManyField(Templates, verbose_name='Тема', related_name='generated_task_templates', blank=True)
    tasks = models.ManyToManyField(Task, verbose_name='Задания', related_name='generated_task_tasks', blank=True)  # Новое поле

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Вариант'
        verbose_name_plural = 'Варианты'
        ordering = ['id', 'title']