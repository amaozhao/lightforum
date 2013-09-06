from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

from friends.models import FriendShip
from api.serializers.friendserializer import FriendShipSerializer
from api.serializers.userserializer import UserSerializer

class FollowingViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
        
    def get_queryset(self):
        if self.request.user.is_authenticated():
            return FriendShip.objects.get_following(self.request.user)
        return []
    
    def get_object(self, queryset=None):
        try:
            return User.objects.get(id = self.kwargs.get('to_user_id', None))
        except:
            return None
        
    def get_paginate_by(self):
        return 50
    
    def pre_save(self, obj):
        obj.from_user = self.request.user