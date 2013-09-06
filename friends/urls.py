#! -*- coding:utf-8 -*-
from django.conf.urls import patterns, url

from friends.views import action

urlpatterns = patterns('',
    url(r'^action$', action, name='action'),
)
