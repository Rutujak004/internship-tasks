from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "user"]
        # 👇 This line is the key
        read_only_fields = ["id", "created_at", "user"]