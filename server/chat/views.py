
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.paginator import Paginator,EmptyPage

from .serializers import ChatRoomSerializer,MessageSerializer
from .models import ChatRoom,ChatMessage

class RoomView(APIView):
    def get(self, request, pk=None, *args, **kwargs):  
        rooms = ChatRoom.objects.all()
        serializer = ChatRoomSerializer(rooms, many=True)
        return Response({'data': serializer.data})    
    
    def post(self, request):
        room_data = request.data
        newRoom = ChatRoom.objects.get_or_create(
            name=room_data['name']
        )

        serializer = ChatRoomSerializer(newRoom[0])
        return Response({'status':'success','data':serializer.data, 'new':newRoom[1]})
    
    def put(self, request, *args, **kwargs):
        id = self.kwargs["pk"]
        room_object = ChatRoom.objects.get(id=id)
        room_object.member.add(request.user.id)

        serializer = ChatRoomSerializer(room_object)
        return Response({'status':'success','data':serializer.data})

    def delete(self, request, *args, **kwargs):
        if 'pk' in self.kwargs:
            ChatRoom.objects.filter(pk=self.kwargs["pk"]).delete()
            return Response({'status':'success'})

class MessageView(APIView):
    def get(self, request, pk=None, *args, **kwargs):
        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 20)
        if 'room' in self.kwargs:  
            messages = ChatMessage.objects.filter(room_id = self.kwargs['room']).order_by('-timestamp')

            paginator = Paginator(messages, page_size)

            try:
                objects = paginator.page(page)
            except EmptyPage:
                objects = []

            serializer = MessageSerializer(objects, many=True)
            
            return Response({'last_page':paginator.num_pages,'data':serializer.data})
     
    def post(self, request):
        message_data = request.data
        newMessage = ChatMessage.objects.create(
            room_id = message_data['room'],
            user_id = message_data['user'],
            message = message_data['message'],
            status = message_data['status'],
        )
        newMessage.save()
        serializer = MessageSerializer(newMessage)
        return Response({'status':'success','data':serializer.data})
    

    def delete(self, request, *args, **kwargs):
        if 'pk' in self.kwargs:
            ChatRoom.objects.filter(pk=self.kwargs["pk"]).delete()
            return Response({'status':'success'})

