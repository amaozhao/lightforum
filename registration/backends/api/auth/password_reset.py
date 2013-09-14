from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth import login as signin
from django.contrib.auth.tokens import default_token_generator
from django.utils.translation import ugettext_lazy as _

from registration.backends.api.baseview import BaseView

from rest_framework import status
from rest_framework.response import Response

from api.serializers.userserializer import SimpleUserSerializer

class PasswordResetView(BaseView):
    """
    A password change backend which implements the simplest possible
    workflow.
    """
    form_class = PasswordResetForm
    serializer_class = SimpleUserSerializer
    template_name = 'registration/password_change_form.html'
    email_template_name='registration/password_reset_email.html'
    subject_template_name='registration/password_reset_subject.txt'

    def create(self, request, *args, **kwargs):
        form = self.get_form_class(request)(data=request.POST)
        if form.is_valid():
            return self.form_valid(form, request)
        else:
            return self.form_invalid(form)

    def get_form_class(self, request=None):
        """
        Returns the form class to use in this view
        """
        return self.form_class

    def get_form(self, form_class):
        """
        Returns an instance of the form to be used in this view.
        """
        return form_class(**self.get_form_kwargs())

    def get_form_kwargs(self):
        """
        Returns the keyword arguments for instantiating the form.
        """
        kwargs = {'initial': {}}
        if self.request.method in ('POST', 'PUT'):
            kwargs.update({
                'data': self.request.POST,
                'files': self.request.FILES,
            })
        return kwargs

    def form_valid(self, form, request=None):
        """
        If the form is valid, redirect to the supplied URL.
        """
        opts = {
            'use_https': request.is_secure(),
            'token_generator': default_token_generator,
            'from_email': settings.ADMINS[0][1],
            'email_template_name': self.email_template_name,
            'subject_template_name': self.subject_template_name,
            'request': request,
        }
        form.save(**opts)
        message = _('''We have sent you an email with a link to reset your password.  Please check
your email and click the link to continue.''')
        headers = self.get_success_headers({})
        return Response({'message': message}, status=status.HTTP_201_CREATED,
                        headers=headers)

    def form_invalid(self, form):
        """
        If the form is invalid, re-render the context data with the
        data-filled form and errors.
        """
        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = {}
        if 'view' not in kwargs:
            context['view'] = self
        context.update(kwargs)
        return context
