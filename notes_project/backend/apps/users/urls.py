from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UserViewSet, me

router = DefaultRouter()
router.register("users", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("me/", me, name="me"),
]