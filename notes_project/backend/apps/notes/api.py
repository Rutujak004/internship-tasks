from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import NoteSerializer
from .views import NoteService
from .models import Note


class NoteViewSet(viewsets.ModelViewSet):
    """
    API layer for Notes.
    Delegates business logic to NoteService.
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return notes belonging to the logged-in user
        return NoteService.list_notes_for_user(self.request.user)

    def perform_create(self, serializer):
        # Use validated data from serializer
        data = serializer.validated_data
        note = NoteService.create_note(
            user=self.request.user,
            title=data.get("title"),
            content=data.get("content"),
        )
        # Attach created instance back to serializer
        serializer.instance = note

    def perform_update(self, serializer):
        note = serializer.instance
        data = serializer.validated_data
        updated_note = NoteService.update_note(
            note,
            title=data.get("title"),
            content=data.get("content"),
        )
        # Ensure serializer knows about updated instance
        serializer.instance = updated_note

    def perform_destroy(self, instance):
        NoteService.delete_note(instance)