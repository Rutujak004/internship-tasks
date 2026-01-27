from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "role")


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "role")


class CustomUserAdmin(UserAdmin):
    model = User
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    list_display = ("username", "role", "is_staff", "is_active")
    list_filter = ("role",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Role Info", {"fields": ("role",)}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "role", "password1", "password2", "is_staff", "is_active"),
        }),
    )

    search_fields = ("username",)
    ordering = ("username",)


admin.site.register(User, CustomUserAdmin)
