from django.urls import path
from . import views
from .views import patient_dashboard, doctor_dashboard, book_appointment, appointment_list, delete_appointment

urlpatterns = [
    path('patient/', patient_dashboard, name='patient_dashboard'),
    path('doctor/dashboard/', doctor_dashboard, name='doctor_dashboard'),
    path('doctor/', doctor_dashboard),
    path('book/', book_appointment, name='book_appointment'),
    path('my-appointments/', appointment_list, name='appointment_list'),  
    path('delete/<int:id>/', delete_appointment, name='delete_appointment'),
  path(
        'update-status/<int:id>/<str:status>/',
        views.update_status,
        name='update_status'
    ),

]
