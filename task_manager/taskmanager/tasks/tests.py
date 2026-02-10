from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from tasks.models import Task

User = get_user_model()

class TaskTests(APITestCase):

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
        self.task = Task.objects.create(
            title="Test Task",
            description="Test Description",
            deadline="2026-02-15",
            assigned_to=self.user,
            status="PENDING"
        )

    def test_admin_can_create_task(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse("task-list")  # adjust to your actual route
        data = {
            "title": "New Task",
            "description": "Task description",
            "deadline": "2026-02-20",
            "assigned_to": self.user.id,
            "status": "PENDING"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_can_view_assigned_tasks(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("task-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(t["title"] == "Test Task" for t in response.data))

    def test_admin_can_update_task(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse("task-detail", args=[self.task.id])
        data = {"status": "COMPLETED"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.status, "COMPLETED")

    def test_admin_can_delete_task(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse("task-detail", args=[self.task.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)