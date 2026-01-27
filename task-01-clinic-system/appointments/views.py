from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Appointment
from .forms import AppointmentForm
from django.contrib import messages


@login_required
def patient_dashboard(request):
    """
    Render the patient dashboard with all appointments for the logged-in user.
    """
    appointments = Appointment.objects.filter(patient=request.user).order_by('-date', 'time')
    return render(request, 'appointments/patient_dashboard.html', {'appointments': appointments})


@login_required
def doctor_dashboard(request):
    """
    Render the doctor dashboard with all appointments assigned to the logged-in doctor.
    """
    appointments = Appointment.objects.filter(doctor=request.user).order_by('-date', 'time')
    return render(request, 'appointments/doctor_dashboard.html', {'appointments': appointments})


@login_required
def appointment_list(request):
    """
    List all appointments for the logged-in patient.
    """
    appointments = Appointment.objects.filter(patient=request.user).order_by('-date', 'time')
    return render(request, 'appointments/appointment_list.html', {'appointments': appointments})


@login_required
def book_appointment(request):
    """
    Book a new appointment using AppointmentForm.
    """
    form = AppointmentForm(request.POST or None)
    if form.is_valid():
        appointment = form.save(commit=False)
        appointment.patient = request.user
        appointment.save()
        messages.success(request, "Appointment booked successfully!")
        return redirect('appointment_list')
    return render(request, 'appointments/book.html', {'form': form})


@login_required
def update_status(request, id, status):
    """
    Doctor updates the status of an appointment (approved/rejected).
    Only the doctor assigned to the appointment can update it.
    """
    appointment = get_object_or_404(Appointment, id=id, doctor=request.user)
    appointment.status = status
    appointment.save()
    messages.success(request, f"Appointment status updated to {status}.")
    return redirect('doctor_dashboard')


@login_required
def delete_appointment(request, id):
    """
    Patient deletes their own appointment.
    """
    appointment = get_object_or_404(Appointment, id=id, patient=request.user)
    appointment.delete()
    messages.success(request, "Appointment canceled successfully.")
    return redirect('appointment_list')


def custom_login(request):
    """
    Custom login view for patients and doctors.
    Redirects patients to patient_dashboard and doctors to doctor_dashboard.
    """
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.is_staff:  # doctor
                return redirect('doctor_dashboard')
            else:  # patient
                return redirect('patient_dashboard')
        else:
            messages.error(request, "Invalid username or password.")
            return render(request, 'login.html')
    return render(request, 'login.html')
