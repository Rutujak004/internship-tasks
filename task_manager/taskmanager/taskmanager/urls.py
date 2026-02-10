from django.contrib import admin
from django.urls import path, include
from accounts.views import CustomTokenView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),   # accounts app routes
    path('api/tasks/', include('tasks.urls')),         # tasks app routes

    # JWT endpoints
    path('api/token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]