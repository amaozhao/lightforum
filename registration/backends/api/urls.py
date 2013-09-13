"""
URLconf for registration and activation, using django-registration's
one-step backend.

If the default behavior of these views is acceptable to you, simply
use a line like this in your root URLconf to set up the default URLs
for registration::

    (r'^accounts/', include('registration.backends.simple.urls')),

This will also automatically set up the views in
``django.contrib.auth`` at sensible default locations.

If you'd like to customize registration behavior, feel free to set up
your own URL patterns for these views instead.

"""


from django.conf.urls import include
from django.conf.urls import patterns
from django.conf.urls import url
from django.views.generic.base import TemplateView

from registration.backends.api.views import RegistrationView
from registration.backends.api.auth.signin import SigninView
from registration.backends.api.auth.password_change import PasswordChangeView


urlpatterns = patterns('',
    url(r'^register/$',
        RegistrationView.as_view({'post': 'create'}),
        name='registration_register'),
    url(r'^register/closed/$',
        TemplateView.as_view(template_name='registration/registration_closed.html'),
        name='registration_disallowed'),
    url(r'^signin/$',
        SigninView.as_view({'post': 'create'}),
        name='registration_signin'),
    url(r'^password/change/$',
        PasswordChangeView.as_view({'post': 'create'}),
        name='auth_password_change'),
    (r'', include('registration.auth_urls')),
)
