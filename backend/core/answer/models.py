from django.db import models

class TaskAnswer(models.Model):
    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        verbose_name='Задание'
    )
    answer_text = models.TextField(verbose_name='Ответ на задание', default='')

    def __str__(self):
        return f"Ответ на задание {self.task.title}"

    class Meta:
        verbose_name = 'Ответ на задание'
        verbose_name_plural = 'Ответы на задания'


class Answer(models.Model):
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        verbose_name='Пользователь'
    )
    generated_task = models.ForeignKey(
        'generatedTask.GeneratedTask',
        on_delete=models.CASCADE,
        verbose_name='Вариант'
    )
    task_answers = models.ManyToManyField(
        'TaskAnswer',
        verbose_name='Ответы на задания'
    )
    anonymous_solution = models.OneToOneField(
        'AnonymousSolution',
        on_delete=models.CASCADE,
        verbose_name='Анонимное решение',
        null=True,
        blank=True
    )

    def __str__(self):
        if self.user:
            return f"Ответ от {self.user.full_name} на {self.generated_task.hash_code}"
        return f"Анонимное решение от {self.anonymous_solution.full_name} на {self.generated_task.hash_code}"

    class Meta:
        verbose_name = 'Ответ'
        verbose_name_plural = 'Ответы'

class AnonymousSolution(models.Model):
    full_name = models.CharField(max_length=255, verbose_name='ФИО')
    generated_task = models.ForeignKey(
        'generatedTask.GeneratedTask',
        on_delete=models.CASCADE,
        verbose_name='Вариант',
        null=True,  # Временно разрешаем null
        blank=True
    )
    task_answers = models.ManyToManyField(
        'TaskAnswer',
        verbose_name='Ответы на задания'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    def __str__(self):
        return f"Анонимное решение от {self.full_name} на {self.generated_task.hash_code}"

    class Meta:
        verbose_name = 'Анонимное решение'
        verbose_name_plural = 'Анонимные решения'