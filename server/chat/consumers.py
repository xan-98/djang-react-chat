import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import ChatRoom, ChatMessage
# from apps.user.models import User, OnlineUser
from django.contrib.auth.models import User
from .serializers import ChatRoomSerializer,MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
	def getUser(self, userId):
		return User.objects.get(id=userId)

	def getRoomList(self):
		room_list = ChatRoom.objects.all()
		serializer = ChatRoomSerializer(room_list, many=True)
		return serializer.data

	def addRoom(self, room_name):
		try:
			ChatRoom.objects.get_or_create(name=room_name)
		except:
			pass
	
	def joinRoom(self, room_id):
		room_object = ChatRoom.objects.get(id=room_id)
		room_object.member.add(self.userId)


	def exitRoom(self,userId):

		try:
			rooms = ChatRoom.objects.filter(member=userId)
			user = User.objects.get(id = userId)
			for room in rooms:
				room.member.remove(user)
		except:
			pass

	def saveMessage(self, message, userId, roomId):
		chatMessageObj = ChatMessage.objects.create(
			room_id = roomId, 
			user_id = userId,
			message=message,
		)
		chatMessageObj.save()
		data = MessageSerializer(chatMessageObj).data
		data['action'] = 'message'
		return data
	
	def readMessage(self, userid, roomId):
		ChatMessage.objects.exclude(user_id=userid).filter(room_id = roomId).update(status=True)
		return {
			'action' : 'read',
			'room' : roomId
		}

	async def sendRoomList(self, toSelf=False):
		roomList = await database_sync_to_async(self.getRoomList)()
		chatMessage = {
			'type': 'chat_message',
			'message':{
				'action': 'list_room',
				'list':  roomList
			}
		}
		# await self.channel_layer.group_send('onlineUser', chatMessage)
		await self.channel_layer.group_send('room_list', chatMessage)

	async def connect(self):
		self.userId = self.scope['url_route']['kwargs']['userId']
		self.userRooms = await database_sync_to_async(
			list
		)(ChatRoom.objects.filter(member=self.userId))
		for room in self.userRooms:
			await self.channel_layer.group_add(
				'room_' + str(room.id),
				self.channel_name
			)
		await self.channel_layer.group_add('room_list', self.channel_name)
		self.user = await database_sync_to_async(self.getUser)(self.userId)
		# await database_sync_to_async(self.addOnlineUser)(self.user)
		await self.sendRoomList()
		await self.accept()

	async def disconnect(self, close_code):
		# await self.exitRoom()
		self.userRooms = await database_sync_to_async(
			list
		)(ChatRoom.objects.filter(member=self.userId))

		for room in self.userRooms:
			await self.channel_layer.group_discard(
				'room_' + str(room.id),
				self.channel_name
			)
		print('Disconnent --->', self.userId)
		await database_sync_to_async(self.exitRoom)(self.userId)
		await self.sendRoomList()
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		action = text_data_json['action']
		# chatMessage = {}
		if action == 'message':
			roomId = text_data_json['room']
			message = text_data_json['message']
			userId = text_data_json['user']
			chatMessage = await database_sync_to_async(
				self.saveMessage
			)(message, userId, roomId)
			await self.channel_layer.group_send(
				'room_' + str(roomId),
					{
						'type': 'chat_message',
						'message': chatMessage
					}
				)
		
		elif action == 'read':
			roomId = text_data_json['room']
			userId = text_data_json['user']
			chatMessage = await database_sync_to_async(
				self.readMessage
			)(userId, roomId)
			await self.channel_layer.group_send(
				'room_' + str(roomId),
					{
						'type': 'chat_message',
						'message': chatMessage
					}
				)
		
		elif action == 'new_room':
				room_name = text_data_json['room_name']
				await database_sync_to_async(self.addRoom)(room_name)
				await self.sendRoomList()
		elif action == 'join_room':
				room_id = text_data_json['room_id']
	
				await self.channel_layer.group_add('room_' + str(room_id), self.channel_name)
				await database_sync_to_async(self.joinRoom)(room_id)
				await self.sendRoomList()
				
		elif action == 'exit_room':
				room_id = text_data_json['room_id']
				
				await self.channel_layer.group_discard(
					'room_' + str(room_id),
					self.channel_name
				)
				await database_sync_to_async(self.exitRoom)(self.userId)
				await self.sendRoomList()
		# elif action == 'typing':
		# 	chatMessage = text_data_json
		

	async def chat_message(self, event):
		message = event['message']
		await self.send(text_data=json.dumps(message))
