from rest_framework import viewsets, permissions

from forum.models import Topic
from comments.models import Comment
from api.serializers.commentserializer import CommentSerializer
from api.permissions import IsOwnerOrReadOnly

class CommentViewset(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly, )
        
    def get_queryset(self):
        topic = Topic.objects.get(id = self.kwargs.get('topic_id', None))
        return Comment.objects.filter(topic = topic)
    
    def pre_save(self, obj):
        obj.author = self.request.user
        obj.topic = Topic.objects.get(id = self.kwargs.get('topic_id', None))