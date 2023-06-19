from rest_framework import serializers
from .models import ChatRoom,ChatMessage

class ChatRoomSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()
    class Meta:
        model = ChatRoom
        fields = ['id', 'name','member']

    def get_member(self, obj):
        memberCount = obj.member.all().count()
        return memberCount

class MessageSerializer(serializers.ModelSerializer):
    user_id =  serializers.ReadOnlyField(source='user.id') 
    username =  serializers.ReadOnlyField(source='user.username')

    date = serializers.DateTimeField(source='timestamp',read_only=True, format="%d.%m.%Y")
    time = serializers.DateTimeField(source='timestamp',read_only=True, format="%H:%M")
    class Meta:
        model = ChatMessage
        fields = ['id', 'user_id','username','room','message','status','date','time','timestamp']

