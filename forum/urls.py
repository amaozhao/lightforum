from django.conf.urls import patterns, url

from forum.views import home

urlpatterns = patterns('',
    url(r'^$', home, name='index'),
    url(r'^', home, name='index'),
)