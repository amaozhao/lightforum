from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^topics/', include('api.urls.topicurls')),
    url(r'^topics', include('api.urls.topicurls')),
    url(r'^comments/', include('api.urls.commenturls')),
    url(r'^users/', include('api.urls.userurls')),
    url(r'^myfollowing/', include('api.urls.myfollowingurls')),
    url(r'^myfans/', include('api.urls.myfansurls')),
    url(r'^profile/', include('api.urls.profileurls')),
    url(r'^notifications/', include('api.urls.notificationurls')),
)