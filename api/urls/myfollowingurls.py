from django.conf.urls import patterns, url

from api.views.followingviewset import FollowingViewset

following_list = FollowingViewset.as_view({
    'get': 'list',
    'post': 'create'
})

following_detail = FollowingViewset.as_view({
    'get': 'retrieve',
    'delete': 'destroy'
})

urlpatterns = patterns('',
    url(r'^$', following_list, name='following-list'),
    url(r'^(?P<to_user_id>[0-9]+)$', following_detail, name='following-detail'),
)