# accounts/forms.py
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import User

class RoleBasedAuthenticationForm(AuthenticationForm):
    role = forms.ChoiceField(choices=User.ROLE_CHOICES, required=True)

    def confirm_login_allowed(self, user):
        # Ensure the user role matches the selected role
        selected_role = self.cleaned_data.get('role')
        if user.role != selected_role:
            raise forms.ValidationError(
                "Selected role does not match your account role.",
                code='invalid_role'
            )
