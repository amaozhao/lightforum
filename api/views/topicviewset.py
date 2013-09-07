from django.db.models import Count

from rest_framework import viewsets, permissions
from rest_framework.response import Response

from forum.models import Topic
from notify.models import Notification
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
    
    def retrieve(self, request, *args, **kwargs):
        self.object = self.get_object()
        if self.request.user.is_authenticated():
            try:
                notification = Notification.objects.get(owner = self.request.user, topic = self.object)
                notification.set_read()
            except:
                pass
        serializer = self.get_serializer(self.object)
        return Response(serializer.data)
    
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