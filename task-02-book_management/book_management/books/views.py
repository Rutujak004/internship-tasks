from django.shortcuts import render, redirect, get_object_or_404
from .models import Book
from .forms import BookForm

# Create your views here.


# LIST
def book_list(request):
    books = Book.objects.all()
    return render(request, 'books/list.html', {'books': books})

# ADD
def add_book(request):
    form = BookForm()
    if request.method == "POST":
        form = BookForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('book_list')
    return render(request, 'books/add.html', {'form': form})

# VIEW
def view_book(request, id):
    book = get_object_or_404(Book, id=id)
    return render(request, 'books/view.html', {'book': book})

# EDIT
def edit_book(request, id):
    book = get_object_or_404(Book, id=id)
    form = BookForm(instance=book)
    if request.method == "POST":
        form = BookForm(request.POST, instance=book)
        if form.is_valid():
            form.save()
            return redirect('book_list')
    return render(request, 'books/edit.html', {'form': form})

# DELETE
def delete_book(request, id):
    book = get_object_or_404(Book, id=id)
    book.delete()
    return redirect('book_list')
