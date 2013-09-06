from django.db.models import Count

from rest_framework import viewsets, permissions

from forum.models import Topic
from api.serializers.topicserializer import TopicSerializer, SimpleTopicSerializer
from api.permissions import IsOwnerOrReadOnly

class TopicViewset(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly, )
        
    def get_queryset(self):
        keyword = self.request.GET.get('keyword', None)
        if keyword:
            return Topic.objects.filter(content__contains = keyword)
        return Topic.objects.all()
    
    def get_paginate_by(self):
        return 10
    
    def pre_save(self, obj):
        obj.author = self.request.user
        
class SimpleTopicViewset(viewsets.ModelViewSet):
    serializer_class = SimpleTopicSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly, )
        
    def get_queryset(self):
        return Topic.objects.annotate(count = Count('comments'))\
            .order_by('-count', '-created')[:5]
    
    def pre_save(self, obj):
        obj.author = self.request.user