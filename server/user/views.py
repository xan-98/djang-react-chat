from rest_framework import viewsets
from rest_framework.response import Response


class GetUserViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        user = {
            'id':request.user.id,
            'username':request.user.username,
        }
        return Response({'data':user})