from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
# Create your views here.

def index(request):
    return render(request, "index.html")


def dashboard(request):
    return render(request, "dashboard.html")

def signIn(request):
    if request.user.is_authenticated:
        return redirect("/")
    if(request.method == "POST"):
        username = request.POST['username']
        password = request.POST['pass']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
        return redirect("/")
        
    return render(request, "signin.html")

def signOut(request):
    if request.user.is_authenticated:
        logout(request)
        return redirect("/")
    return redirect("/login")


def signUp(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['pass']
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username=username, password=password, email=email)
            login(request, user)
            return redirect("/")
    return render(request, "signup.html")