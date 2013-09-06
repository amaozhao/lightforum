from django.conf.urls import patterns, url

from api.views.commentviewset import CommentViewset

comment_list = CommentViewset.as_view({
    'get': 'list',
    'post': 'create'
})

comment_detail = CommentViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = patterns('',
    url(r'^(?P<topic_id>[0-9]+)$', comment_list, name='comment-list'),
    url(r'^(?P<topic_id>[0-9]+)/(?P<pk>[0-9]+)$', comment_detail, name='comment-detail'),
)