from django.conf.urls import patterns, url

from api.views.userviewset import (UserViewset, UserSimpleTopicViewset,
                                   UserTopicViewset, SimpleUserViewset)

user_detail = UserViewset.as_view({
    'get': 'retrieve',
})

simpleuser_detail = SimpleUserViewset.as_view({
    'get': 'retrieve',
    'post': 'create'
})

user_simpletopic = UserSimpleTopicViewset.as_view({
    'get': 'list',
})

user_topic = UserTopicViewset.as_view({
    'get': 'list',
})

urlpatterns = patterns('',
    url(r'^(?P<id>[0-9]+)$', user_detail, name='user-detail'),
    # url(r'^(?P<username>\w+)$', user_detail, name='user-detail'),
    url(r'^(?P<id>[0-9]+)/simpletopic$', user_simpletopic, name='user-simple-topic'),
    url(r'^(?P<id>[0-9]+)/topic$', user_topic, name='user-topic'),
    url(r'^auth$', simpleuser_detail, name='simpleuser-detail'),
)
