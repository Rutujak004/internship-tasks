from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from .views import assign_task, mark_task_completed
from .permissions import IsAdminOrOwner


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
   # permission_classes = []
    permission_classes = [IsAuthenticated , IsAdminOrOwner]

    def perform_create(self, serializer):
        task = serializer.save()
        assign_task(task, task.assigned_to)

    def perform_update(self, serializer):
        task = serializer.save()
        if task.status == 'COMPLETED':
            mark_task_completed(task)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Task.objects.all()  # Admin sees all tasks
        return Task.objects.filter(assigned_to=user)  # User sees only their tasks