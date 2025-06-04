from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification, Log
from .serializers import NotificationSerializer, LogSerializer
from authentication.models import User, Group

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['patch'], url_path='mark-as-read')
    def mark_as_read(self, request, pk=None):
        """Пометить уведомление как прочитанное."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'Уведомление помечено как прочитанное'})

    @action(detail=False, methods=['post'], url_path='send')
    def send_notification(self, request):
        """
        Отправить уведомление группе или конкретным пользователям.
        """
        group_id = request.data.get('groupId')
        user_ids = request.data.get('userIds', [])
        message = request.data.get('message')

        if not group_id or not message:
            return Response(
                {'error': 'Необходимо указать groupId и message'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            return Response(
                {'error': 'Группа с указанным ID не найдена'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Если user_ids пустой, отправляем всем пользователям группы
        if not user_ids:
            users = group.students.all()
        else:
            users = User.objects.filter(id__in=user_ids, group=group)

        notifications = []
        for user in users:
            notifications.append(Notification(user=user, message=message, sender=request.user))

        Notification.objects.bulk_create(notifications)

        return Response({'status': 'Уведомления успешно отправлены'}, status=status.HTTP_201_CREATED)

class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer
    permission_classes = [IsAuthenticated]