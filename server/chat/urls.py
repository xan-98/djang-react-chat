from django.urls import path
from .views import RoomView,MessageView

urlpatterns = [
	path('rooms/<int:pk>', RoomView.as_view()),
	path('rooms/', RoomView.as_view()),
	path('messages/<int:room>', MessageView.as_view()),
	path('messages/', MessageView.as_view()),
]
