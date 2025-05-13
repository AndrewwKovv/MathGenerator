from rest_framework import routers
from logi.views import LogViewSet
from notification.views import NotificationViewSet
from userState.views import UserStateViewSet
from tasks.views import TaskViewSet
from authentication.views import UserViewSet
from answer.views import TaskAnswerViewSet, AnswerViewSet
from generatedTask.views import GeneratedTaskViewSet
from group.views import GroupViewSet
from userTaskStatus.views import TaskStatusViewSet


router = routers.DefaultRouter()

router.register(r'task',  TaskViewSet)
router.register(r'auth',  UserViewSet)
router.register(r'task-answers', TaskAnswerViewSet, basename='task-answer')
router.register(r'answers', AnswerViewSet, basename='answer')
router.register(r'generated',  GeneratedTaskViewSet)
router.register(r'group',  GroupViewSet)
router.register(r'status-task',  TaskStatusViewSet)
router.register(r'user-states', UserStateViewSet, basename='user-state')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'logs', LogViewSet, basename='log')






