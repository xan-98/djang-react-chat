from django.urls import path
from .views import GetUserView
from rest_framework.authtoken import views

urlpatterns = [
    path('auth/', views.obtain_auth_token),
	path('', GetUserView.as_view(), name='getuser'),
]
