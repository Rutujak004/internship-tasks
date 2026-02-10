from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role', 'USER')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    # ✅ Use create_user so password is hashed
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role=role
    )
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer