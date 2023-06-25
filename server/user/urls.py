from django.urls import path
from rest_framework.authtoken import views

from .views import GetUserViewSet

urlpatterns = [
    path('auth/', views.obtain_auth_token),
	path('', GetUserViewSet.as_view({'get':'retrieve'}), name='getuser'),
]
