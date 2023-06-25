import os

import chat.routing
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from .middlewares import TokenAuthMiddleWare

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": TokenAuthMiddleWare(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})

