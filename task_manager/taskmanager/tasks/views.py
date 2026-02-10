from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsAdminOrOwner

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def perform_create(self, serializer):
        # Save the task and trigger any assignment logic
        task = serializer.save()
        # If you want to notify or log assignment, do it here
        # e.g., send_email_to_user(task.assigned_to)

    def perform_update(self, serializer):
        task = serializer.save()
        if task.status == 'COMPLETED':
            # handle completion logic here
            pass

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Task.objects.all()
        return Task.objects.filter(assigned_to=user)