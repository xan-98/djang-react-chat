from django.urls import path

from .views import MessageViewSet, RoomViewSet

urlpatterns = [
	path('rooms/<int:pk>', RoomViewSet.as_view({'delete':'destroy'})),
	path('rooms/', RoomViewSet.as_view({'get': 'list','post': 'create'})),
	path('messages/<int:pk>', MessageViewSet.as_view({'get': 'list','delete':'destroy'})),
	path('messages/', MessageViewSet.as_view({'post': 'create'})),
]
