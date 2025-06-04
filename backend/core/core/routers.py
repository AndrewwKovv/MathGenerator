from rest_framework import routers
from notification.views import NotificationViewSet, LogViewSet
from tasks.views import TaskViewSet, TopicViewSet
from authentication.views import UserViewSet, GroupViewSet, TaskStatusViewSet
from answer.views import AnswerViewSet
from generatedTask.views import GeneratedTaskViewSet


router = routers.DefaultRouter()

router.register(r'task',  TaskViewSet)
router.register(r'topic',  TopicViewSet)
router.register(r'auth',  UserViewSet)
router.register(r'answers', AnswerViewSet, basename='answer')
router.register(r'generated', GeneratedTaskViewSet, basename='generated-task')
router.register(r'group',  GroupViewSet)
router.register(r'status-task',  TaskStatusViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'logs', LogViewSet, basename='log')






