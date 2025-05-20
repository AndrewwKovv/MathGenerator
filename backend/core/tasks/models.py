from django.db import models

class Topic(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название темы')
    section_name = models.CharField(max_length=255, verbose_name='Название секции', null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'


class Task(models.Model):
    title = models.CharField(max_length=255, verbose_name='Название задания')
    view = models.TextField(verbose_name='Содержание задания')
    data_task = models.TextField(verbose_name='Содержание задания (латех)', null=True, blank=True)
    topics = models.ManyToManyField(Topic, related_name='tasks', verbose_name='Темы задания')  # Связь с темами

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'