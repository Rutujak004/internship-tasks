from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Note
from .serializers import NoteSerializer

User = get_user_model()

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admins can see all notes, users only their own
        if user.role == 'ADMIN':
            return Note.objects.all()
        return Note.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        note = self.get_object()
        username = request.data.get("username")
        try:
            target_user = User.objects.get(username=username)
            # Duplicate note for target user
            Note.objects.create(
                user=target_user,
                title=note.title,
                content=note.content
            )
            return Response({"status": "Note shared"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)