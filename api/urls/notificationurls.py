from django.conf.urls import patterns, url

from api.views.notificationviewset import NotificationViewset

notification_list = NotificationViewset.as_view({
    'get': 'list',
    'post': 'create'
})

notification_detail = NotificationViewset.as_view({
    'get': 'retrieve',
    'put': 'update',
})

urlpatterns = patterns('',
    url(r'^$', notification_list, name='notification-list'),
    url(r'^(?P<pk>[0-9]+)$', notification_detail, name='notification-detail'),
)