from .models import Note

class NoteService:
    """Business logic for Notes"""

    @staticmethod
    def list_notes_for_user(user):
        return Note.objects.filter(user=user)

    @staticmethod
    def create_note(user, title, content):
        note = Note.objects.create(user=user, title=title, content=content)
        return note

    @staticmethod
    def update_note(note, title=None, content=None):
        if title:
            note.title = title
        if content:
            note.content = content
        note.save()
        return note

    @staticmethod
    def delete_note(note):
        note.delete()
        return True