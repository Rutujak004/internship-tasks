from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from .serializers import UserSerializer
from .views import UserService
from .models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()

    def get_permissions(self):
        # Allow anyone to register (create)
        if self.action == "create":
            return [AllowAny()]
        # Admins can list, update, delete users
        return [IsAdminUser()]

    def perform_create(self, serializer):
        data = serializer.validated_data
        # Force role="user" so nobody can self-register as admin
        user = UserService.create_user(
            username=data.get("username"),
            email=data.get("email"),
            role="user",   # 👈 always user
            password=data.get("password"),
        )
        serializer.instance = user


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)