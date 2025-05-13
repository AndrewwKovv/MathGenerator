from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название задания')
    view = models.TextField(verbose_name='Содержание задания (латех)')
    template = models.TextField(verbose_name='Шаблон задания', null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'


class Topic(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название темы')
    section_name = models.CharField(max_length=255, verbose_name='Название секции', null=True)
    tasks = models.ManyToManyField(Task, related_name='topics', verbose_name='Задания')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'