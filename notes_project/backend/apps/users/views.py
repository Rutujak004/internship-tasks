from .models import CustomUser

class UserService:
    """Business logic for Users"""

    @staticmethod
    def list_users():
        return CustomUser.objects.all()

    @staticmethod
    def create_user(username, email, role, password):
        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            role=role,
            password=password
        )
        return user