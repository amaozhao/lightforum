from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import login as signin

from registration.backends.api.baseview import BaseView

from rest_framework import status
from rest_framework.response import Response

from api.serializers.userserializer import SimpleUserSerializer


class PasswordChangeView(BaseView):
    """
    A registration backend which implements the simplest possible
    workflow: a user supplies a username, email address and password
    (the bare minimum for a useful account), and is immediately signed
    up and logged in).
    """
    form_class = PasswordChangeForm
    template_name = 'registration/password_change_form.html'


    def create(self, request, *args, **kwargs):
        form = self.get_form_class(request)(user=request.user, data=request.POST)
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
        form.save()
        headers = self.get_success_headers({})
        return Response({'done': 'success'}, status=status.HTTP_201_CREATED,
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
