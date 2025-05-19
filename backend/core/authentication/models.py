from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Permission
from group.models import Group
from generatedTask.models import GeneratedTask
from userTaskStatus.models import TaskStatus


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
        'group.Group',
        verbose_name='Группа',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )  # Только для студентов
    groups = models.ManyToManyField(
        'group.Group',
        verbose_name='Группы',
        blank=True,
        null=True,
        related_name='teachers'
    )  # Только для преподавателей
    task_status = models.ManyToManyField(
        'userTaskStatus.TaskStatus',
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


    