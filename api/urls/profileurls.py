from django.conf.urls import patterns, url

from api.views.profileviewset import ProfileViewset

profile_detail = ProfileViewset.as_view({
    'get': 'retrieve',
    'post': 'update',
})

urlpatterns = patterns('',
    url(r'^$', profile_detail, name='profile-detail'),
)