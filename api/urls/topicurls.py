from django.conf.urls import patterns, url

from api.views.topicviewset import TopicViewset, SimpleTopicViewset

topic_list = TopicViewset.as_view({
    'get': 'list',
    'post': 'create'
})

simple_topic_list = SimpleTopicViewset.as_view({
    'get': 'list',
})

topic_detail = TopicViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = patterns('',
    url(r'^$', topic_list, name='topic-list'),
    url(r'^hot$', simple_topic_list, name='hot-topic-list'),
    url(r'^(?P<pk>[0-9]+)$', topic_detail, name='topic-detail'),
)