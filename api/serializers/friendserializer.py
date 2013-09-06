from rest_framework import serializers

from friends.models import FriendShip

class FriendShipSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FriendShip
        fields = ('id', 'to_user', 'from_user',)
        read_only_fields = ('id',)