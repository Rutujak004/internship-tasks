from rest_framework import viewsets, permissions
from .models import CustomUser
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        # Admins can create/update/delete users
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        # Any authenticated user can list users (needed for dropdown)
        return [permissions.IsAuthenticated()]