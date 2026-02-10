from rest_framework.permissions import BasePermission

class IsAdminOrOwner(BasePermission):
    """
    Admins can access all tasks.
    Users can only access their own tasks.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.role == 'ADMIN':
            return True
        # Users can only access their own tasks
        return obj.assigned_to == request.user