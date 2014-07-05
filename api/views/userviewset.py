from django.contrib.auth.models import User

from rest_framework import viewsets, permissions
from api.serializers.userserializer import UserSerializer, SimpleUserSerializer
from api.serializers.topicserializer import (SimpleTopicSerializer,
                                             TopicSerializer)
from api.permissions import IsOwnerOrReadOnly
from forum.models import Topic


class SimpleUserViewset(viewsets.ModelViewSet):
    serializer_class = SimpleUserSerializer

    def get_object(self, queryset=None):
        return self.request.user

    def create(self, request, *args, **kwargs):
        return

    def put(self, request, *args, **kwargs):
        return


class SimpleAuthorViewset(SimpleUserViewset):
    serializer_class = UserSerializer

    def get_object(self, queryset=None):
        user = User.objects.get(id=self.kwargs.get('author', None))
        return user


class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )

    def get_object(self, queryset=None):
        id = self.kwargs.get('id', None)
        user = Topic.objects.get(id=id).author
        return user

    def post(self, request, *args, **kwargs):
        return

    def put(self, request, *args, **kwargs):
        return


class UserSimpleTopicViewset(viewsets.ModelViewSet):
    serializer_class = SimpleTopicSerializer
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly, )

    def get_queryset(self):
        user = Topic.objects.get(id=self.kwargs.get('id', None)).author
        return Topic.objects.filter(author=user)[:5]


class AuthorSimpleTopicViewset(UserSimpleTopicViewset):

    def get_queryset(self):
        user = User.objects.get(id=self.kwargs.get('author', None))
        return Topic.objects.filter(author=user)[:5]


class UserTopicViewset(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly, )

    def get_queryset(self):
        id = self.kwargs.get('id', None)
        user = User.objects.get(id=id)
        return Topic.objects.filter(author=user)

    def get_paginate_by(self):
        return 10

    def pre_save(self, obj):
        obj.author = self.request.user
