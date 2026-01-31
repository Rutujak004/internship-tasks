### Task 04 – CRUD Operations Using REST API with PostgreSQL
**Description:**  
A Django REST framework project with PostgreSQL backend for book management.

**Features:**  
- Full CRUD functionality via REST API  
- PostgreSQL database connection 
- JSON responses for API endpoints   

**Tech Stack:**  
- Python 3.12  
- Django  
- PostgreSQL  
- Django REST Framework  

**How to Run:**  
1.Install PostgreSQL and create a database.

2.Update settings.py with your PostgreSQL credentials:

3.Run migrations and start server:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
