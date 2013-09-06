from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'lightforum.views.home', name='home'),
    # url(r'^lightforum/', include('lightforum.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('api.urls')),
    url(r'^friends/', include('friends.urls')),
    url(r'^accounts/', include('registration.backends.simple.urls')),
    # url(r'^accounts/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^', include('forum.urls')),
)
