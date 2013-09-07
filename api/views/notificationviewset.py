from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.response import Response

from notify.models import Notification

from api.serializers.notificationserializer import NotificationSerializer
from api.permissions import NotificationPermission

class NotificationViewset(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, NotificationPermission, )
    
    def create(self, request, *args, **kwargs):
        try:
            for notification in self.get_queryset():
                notification.set_read()
            return Response([], status=status.HTTP_201_CREATED)
        except:
            return Response({'error': 'error'}, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        self.object = self.get_object_or_none()
        self.object.set_read()

        return Response({}, status=status.HTTP_200_OK)

        return Response({'error': 'error'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        if self.request.user.is_authenticated():
            return Notification.objects.filter(owner = self.request.user, unread = True)
        else:
            return []
