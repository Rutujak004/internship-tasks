# appointments/admin.py
from django.contrib import admin
from .models import Appointment, DoctorAvailability

admin.site.register(Appointment)
admin.site.register(DoctorAvailability)
