from django.contrib.auth.models import User
from django.db import models


class ChatRoom(models.Model):
	member = models.ManyToManyField(User)
	name = models.CharField(max_length=250)

	def __str__(self):
		return str(self.id) + ' -> ' + str(self.name)

class ChatMessage(models.Model):
	room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	message = models.CharField(max_length=250)
	status = models.BooleanField(default=False)
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.message
