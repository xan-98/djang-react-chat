import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import ChatMessage, ChatRoom
from django.contrib.auth.models import User

from .serializers import ChatRoomSerializer, MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
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
		room_object.member.add(self.user.id)


	def exitRoom(self,user_id):

		try:
			rooms = ChatRoom.objects.filter(member=user_id)
			user = User.objects.get(id = user_id)
			for room in rooms:
				room.member.remove(user)
		except:
			pass

	def saveMessage(self, message, user_id, room_id):
		chatMessageObj = ChatMessage.objects.create(
			room_id = room_id, 
			user_id = user_id,
			message=message,
		)
		chatMessageObj.save()
		data = MessageSerializer(chatMessageObj).data
		data['action'] = 'message'
		return data
	
	def readMessage(self, user_id, room_id):
		ChatMessage.objects.exclude(user_id=user_id).filter(room_id = room_id).update(status=True)
		return {
			'action' : 'read',
			'room' : room_id
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
		self.user = self.scope['user']
		self.userRooms = await database_sync_to_async(
			list
		)(ChatRoom.objects.filter(member=self.user.id))
		for room in self.userRooms:
			await self.channel_layer.group_add(
				'room_' + str(room.id),
				self.channel_name
			)
		await self.channel_layer.group_add('room_list', self.channel_name)
		await self.sendRoomList()
		await self.accept()

	async def disconnect(self, close_code):
		# await self.exitRoom()
		self.userRooms = await database_sync_to_async(
			list
		)(ChatRoom.objects.filter(member=self.user.id))

		for room in self.userRooms:
			await self.channel_layer.group_discard(
				'room_' + str(room.id),
				self.channel_name
			)
		print('Disconnent --->', self.user.id)
		await database_sync_to_async(self.exitRoom)(self.user.id)
		await self.sendRoomList()
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		action = text_data_json['action']

		if action == 'message':
			room_id = text_data_json['room']
			message = text_data_json['message']
			chatMessage = await database_sync_to_async(
				self.saveMessage
			)(message, self.user.id, room_id)
			await self.channel_layer.group_send(
				'room_' + str(room_id),
					{
						'type': 'chat_message',
						'message': chatMessage
					}
				)
		
		elif action == 'read':
			room_id = text_data_json['room']
			chatMessage = await database_sync_to_async(
				self.readMessage
			)(self.user.id, room_id)
			await self.channel_layer.group_send(
				'room_' + str(room_id),
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
				await database_sync_to_async(self.exitRoom)(self.user.id)
				await self.sendRoomList()

	async def chat_message(self, event):
		message = event['message']
		await self.send(text_data=json.dumps(message))
