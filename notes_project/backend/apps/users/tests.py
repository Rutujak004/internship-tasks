from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from apps.users.models import CustomUser
from apps.users.views import UserService

class UserServiceTest(TestCase):
    def test_create_user(self):
        user = UserService.create_user("john", "john@example.com", "user", "pass123")
        self.assertEqual(user.username, "john")
        self.assertEqual(user.role, "user")

    def test_list_users(self):
        CustomUser.objects.create_user(username="alice", password="pass123", role="user")
        users = UserService.list_users()
        self.assertEqual(len(users), 1)
        self.assertEqual(users[0].username, "alice")