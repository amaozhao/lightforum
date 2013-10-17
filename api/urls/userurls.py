from django.conf.urls import patterns, url

from api.views.userviewset import (UserViewset, UserSimpleTopicViewset, AuthorSimpleTopicViewset,
                                   UserTopicViewset, SimpleUserViewset, SimpleAuthorViewset)

user_detail = UserViewset.as_view({
    'get': 'retrieve',
})

simpleuser_detail = SimpleUserViewset.as_view({
    'get': 'retrieve',
    'post': 'create'
})

simpleauthor_detail = SimpleAuthorViewset.as_view({
    'get': 'retrieve',
})

user_simpletopic = UserSimpleTopicViewset.as_view({
    'get': 'list',
})

author_simpletopic = AuthorSimpleTopicViewset.as_view({
    'get': 'list',
})

user_topic = UserTopicViewset.as_view({
    'get': 'list',
})

urlpatterns = patterns('',
    url(r'^topic/(?P<id>[0-9]+)$', user_detail, name='user-detail'),
    url(r'^author/(?P<author>[0-9]+)$', simpleauthor_detail, name='author-detail'),
    url(r'^topic/(?P<id>[0-9]+)/simpletopic$', user_simpletopic, name='user-simple-topic'),
    url(r'^author/(?P<author>[0-9]+)/simpletopic$', author_simpletopic, name='author-simple-topic'),
    url(r'^(?P<id>[0-9]+)/topics$', user_topic, name='user-topic'),
)
