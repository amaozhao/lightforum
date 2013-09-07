from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.response import Response

from api.serializers.profileserializer import ProfileSerializer
from api.permissions import IsOwnerOrReadOnly

class ProfileViewset(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly, )
        
    def update(self, request, *args, **kwargs):
        self.object = self.get_object_or_none()
        if self.object is None:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        return super(ProfileViewset, self).update(request, *args, **kwargs)
    
    def get_object(self, queryset=None):
        try:
            return self.request.user.get_profile()
        except:
            return None
        
    def pre_save(self, obj):
        obj.user = self.request.user