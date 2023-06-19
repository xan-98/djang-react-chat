from rest_framework.response import Response
from rest_framework.views import APIView


class GetUserView(APIView):
    def get(self, request, pk=None, *args, **kwargs): 
        user = {
            'id':request.user.id,
            'username':request.user.username,
        }
        return Response({'data':user})    
