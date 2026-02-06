from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.notes.models import Note
from apps.notes.views import NoteService

User = get_user_model()

class NoteServiceTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass123")

    def test_create_note(self):
        note = NoteService.create_note(self.user, "Title", "Content")
        self.assertEqual(note.title, "Title")
        self.assertEqual(note.user, self.user)