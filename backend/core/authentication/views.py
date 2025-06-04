from rest_framework import viewsets
from .models import User, Group, TaskStatus
from .serializers import UserSerializer, GroupSerializer, TaskStatusSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(methods=['POST'], detail=False, url_path='registration')
    def register(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'message': 'Готово'})

    @action(methods=['POST'], detail=False, url_path='login')
    def login(sefl, request):
        if 'email' not in request.data:
            raise ValidationError({'error': 'введите почту'})
        if 'password' not in request.data:
            raise ValidationError({'error': 'введите пароль'})

        try: 
            user = User.objects.get(email=request.data['email'])    
        except User.DoesNotExist:
            raise NotFound({'error': 'пользователь не найден'})

        if not user.check_password(request.data['password']):
            raise AuthenticationFailed({'error': 'неверный пароль'})

        if not user.is_active:
            raise AuthenticationFailed({'error': 'подтвердите на почте'})    

        refresh = RefreshToken.for_user(user)
        response = Response()
        response.set_cookie('refresh', str(refresh))
        response.data = {'access': str(refresh.access_token)}
        return response

    @action(methods=['GET'], detail=False, permission_classes=[IsAuthenticated], url_path='account')
    def get_user(self, request):
        user = request.user
        data = self.serializer_class(user).data
        return Response(data)
    
    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated], url_path='logout')
    def logout(self, request):
        response = Response()
        response.delete_cookie('refresh')
        return response
    
    @action(methods=['PUT'], detail=False, permission_classes=[IsAuthenticated], url_path='update')
    def update_user(self, request):
        user = request.user  # Получаем текущего пользователя
        serializer = self.serializer_class(user, data=request.data, partial=True)  # partial=True для частичного обновления
        serializer.is_valid(raise_exception=True)

        # Проверяем, что пользователь не пытается изменить критические поля (например, роль)
        if 'role' in request.data and request.data['role'] != user.role:
            raise PermissionDenied({'error': 'Вы не можете изменить свою роль'})

        serializer.save()  # Сохраняем изменения
        return Response(serializer.data)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class TaskStatusViewSet(viewsets.ModelViewSet):
    queryset = TaskStatus.objects.all()
    serializer_class = TaskStatusSerializer
    permission_classes = [IsAuthenticated]