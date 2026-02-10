from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
router.register(r"", TaskViewSet, basename="task")  # register at root

urlpatterns = router.urls