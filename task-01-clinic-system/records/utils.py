from reportlab.pdfgen import canvas

def generate_prescription(record, path):
    c = canvas.Canvas(path)
    c.drawString(100, 800, "Prescription")
    c.drawString(100, 760, f"Diagnosis: {record.diagnosis}")
    c.drawString(100, 720, f"Medicine: {record.prescription}")
    c.save()



from django.core.mail import send_mail

def send_reminder(appointment):
    send_mail(
        'Appointment Reminder',
        f'You have appointment with Dr. {appointment.doctor.username}',
        'clinic@example.com',
        [appointment.patient.email],
    )
