from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Permission
from generatedTask.models import GeneratedTask

from authentication.managers import UserManager

# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [
        ('student', 'Студент'),
        ('teacher', 'Преподаватель'),
        ('admin', 'Администратор'),
    ]

    email = models.EmailField(verbose_name='Почта', max_length=255, unique=True)
    full_name = models.CharField(verbose_name='Имя', max_length=255)
    group = models.ForeignKey(
        'authentication.Group',
        verbose_name='Группа',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )  # Только для студентов
    groups = models.ManyToManyField(
        'authentication.Group',
        verbose_name='Группы',
        blank=True,
        related_name='teachers'
    )  # Только для преподавателей
    task_status = models.ManyToManyField(
        'authentication.TaskStatus',
        verbose_name='Статус задания',
        related_name='users',
        blank=True
    )
    generated_tasks = models.ManyToManyField(
        'generatedTask.GeneratedTask',
        verbose_name='Варианты',
        related_name='users',
        blank=True
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='Права пользователя',
        related_name='auth_user_permissions',  # Уникальное имя обратной связи
        blank=True,
    )

    is_active= models.BooleanField(verbose_name='активный пользователь', default=False)
    is_staff= models.BooleanField(verbose_name='персонал', default=False)
    is_superuser= models.BooleanField(verbose_name='админ', default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['id', 'email']


class Group(models.Model):
    created_at = models.DateTimeField(verbose_name='время создания', auto_now_add = True, null=True, blank=True)
    update_at = models.DateTimeField(verbose_name='время обновления', auto_now = True, null=True, blank=True)
    name = models.CharField(verbose_name='Номер группы', max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'
        ordering = ['id', 'name']

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
        user_name = self.user.full_name if self.user else "Неизвестный пользователь"
        task_code = self.generated_task.hash_code if self.generated_task else "Неизвестный вариант"
        return f"{user_name} - {task_code}"

    class Meta:
        verbose_name = 'Статус задания'
        verbose_name_plural = 'Статусы заданий'