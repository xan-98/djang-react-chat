from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token


@database_sync_to_async
def returnUser(token_string):
    try:
        user = Token.objects.get(key=token_string).user
    except:
        return False
    return user


class TokenAuthMiddleWare:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope["query_string"]
        query_params = query_string.decode()
        query_dict = parse_qs(query_params)
        token = query_dict["token"][0]
        user = await returnUser(token)
        if user:
            scope["user"] = user
            return await self.app(scope, receive, send)
        return False
