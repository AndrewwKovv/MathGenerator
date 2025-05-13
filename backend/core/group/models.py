from django.db import models

# Create your models here.
class Group(models.Model):
    created_at = models.DateTimeField(verbose_name='время создания', auto_now_add = True)
    update_at = models.DateTimeField(verbose_name='время обновления', auto_now = True)
    name = models.CharField(verbose_name='Номер группы', max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'
        ordering = ['id', 'name']
