from django.shortcuts import redirect,render
from django.contrib.auth.decorators import login_required

@login_required
def role_login_redirect(request):
    user = request.user

    if user.role == 'ADMIN':
        return redirect('/admin/')
    elif user.role == 'DOCTOR':
        return redirect('/appointments/doctor/')
    elif user.role == 'PATIENT':
        return redirect('/appointments/my-appointments/')
    else:
        return redirect('/accounts/login/')

def home(request):
    return render(request, 'accounts/home.html')