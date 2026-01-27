from django.contrib import admin
from django.urls import path, include
from accounts.views import home, role_login_redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),

    path('redirect/', role_login_redirect),
    path('accounts/', include('django.contrib.auth.urls')),
    path('appointments/', include('appointments.urls')),
   
]
