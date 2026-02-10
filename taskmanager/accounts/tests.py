
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class AccountsTests(APITestCase):

    def setUp(self):
        self.admin = User.objects.create_user(
            username="adminuser",
            email="admin@example.com",
            password="adminpass",
            role="ADMIN"
        )
        self.user = User.objects.create_user(
            username="normaluser",
            email="user@example.com",
            password="userpass",
            role="USER"
        )

    def test_register_user(self):
        url = reverse("register")  # adjust to your actual route name
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass123",
            "role": "USER"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        url = reverse("token_obtain_pair")  # JWT login endpoint
        data = {"username": "normaluser", "password": "userpass"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_admin_can_list_users(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse("user-list")  # adjust to your actual route
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)