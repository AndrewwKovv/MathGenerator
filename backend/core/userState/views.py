from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import UserState
from .serializers import UserStateSerializer

class UserStateViewSet(viewsets.ModelViewSet):
    queryset = UserState.objects.all()
    serializer_class = UserStateSerializer
    permission_classes = [IsAuthenticated]