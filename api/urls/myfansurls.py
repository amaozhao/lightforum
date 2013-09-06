from django.conf.urls import patterns, url

from api.views.fansviewset import FansViewset

fans_list = FansViewset.as_view({
    'get': 'list'
})

fans_detail = FansViewset.as_view({
    'get': 'retrieve'
})

urlpatterns = patterns('',
    url(r'^$', fans_list, name='fans-list'),
    url(r'^(?P<to_user_id>[0-9]+)$', fans_detail, name='fans-detail'),
)