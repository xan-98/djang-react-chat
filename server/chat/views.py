from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.paginator import EmptyPage, Paginator
from rest_framework import viewsets
from rest_framework.response import Response

from .models import ChatMessage, ChatRoom
from .serializers import ChatRoomSerializer, MessageSerializer


class RoomViewSet(viewsets.ViewSet):
    def list(self, request):  
        rooms = ChatRoom.objects.all()
        serializer = ChatRoomSerializer(rooms, many=True)
        return Response({'data': serializer.data})    
    
    def create(self, request):
        room_data = request.data
        newRoom = ChatRoom.objects.get_or_create(
            name=room_data['name']
        )
        newRoom[0].save()
        serializer = ChatRoomSerializer(ChatRoom.objects.all(), many=True)

        if newRoom[1]:
            channel_layer = get_channel_layer()

            async_to_sync(channel_layer.group_send)(
                    'room_list',
                    {
                        'type': 'chat_message',
                        'message':{
                            'action': 'list_room',
                            'list':  serializer.data
                        }
                    }
                )

        return Response({'status':'success', 'new':newRoom[1]})

    def destroy(self, request, pk=None):
        if pk:
            ChatRoom.objects.filter(pk=pk).delete()
            return Response({'status':'success'})

class MessageViewSet(viewsets.ViewSet):
    def list(self, request, pk=None):
        page = request.query_params.get('page', 1)
        page_size = request.query_params.get('page_size', 20)
        if pk:  
            messages = ChatMessage.objects.filter(room_id = pk).order_by('-timestamp')

            paginator = Paginator(messages, page_size)

            try:
                objects = paginator.page(page)
            except EmptyPage:
                objects = []

            serializer = MessageSerializer(objects, many=True)
            
            return Response({'last_page':paginator.num_pages,'data':serializer.data})
     
    def create(self, request):
        message_data = request.data
        newMessage = ChatMessage.objects.create(
            room_id = message_data['room'],
            user_id = request.user.id,
            message = message_data['message']
        )
        newMessage.save()
        serializer = MessageSerializer(newMessage)
        data = serializer.data
        data['action'] = 'message'

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
                'room_' + str(message_data['room']),
                {
                    'type': 'chat_message',
                    'message': data
                }
            )

        return Response({'status':'success','data':data})
    
    def destroy(self, request, pk=None):
        if pk:
            ChatMessage.objects.filter(pk=pk,user_id = request.user.id).delete()
            return Response({'status':'success','data':None})
