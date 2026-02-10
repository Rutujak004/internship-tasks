from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register_user
from .api import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Registration endpoint
    path("register/", register_user, name="register"),

    # User management endpoints
    path("", include(router.urls)),
]