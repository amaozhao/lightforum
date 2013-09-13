from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth.models import User

from registration import signals
from registration.forms import RegistrationForm
from registration.backends.api.baseview import BaseView

from rest_framework import status
from rest_framework.response import Response

from api.serializers.userserializer import SimpleUserSerializer


class RegistrationView(BaseView):
    """
    A registration backend which implements the simplest possible
    workflow: a user supplies a username, email address and password
    (the bare minimum for a useful account), and is immediately signed
    up and logged in).
    """
    serializer_class = SimpleUserSerializer
    disallowed_url = 'registration_disallowed'
    form_class = RegistrationForm
    template_name = 'registration/registration_form.html'

    def register(self, request, **cleaned_data):
        username, email, password = cleaned_data['username'], cleaned_data['email'], cleaned_data['password1']
        user = User.objects.create_user(username, email, password)

        new_user = authenticate(username=username, password=password)
        login(request, new_user)
        signals.user_registered.send(sender=self.__class__,
                                     user=new_user,
                                     request=request)
        return user

    def create(self, request, *args, **kwargs):
        form_class = self.get_form_class(request)
        form = self.get_form(form_class)
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

    def form_valid(self, form, request=None):
        """
        If the form is valid, redirect to the supplied URL.
        """
        self.object = new_user = self.register(request, **form.cleaned_data)
        context = self.get_serializer_context()
        serializer = self.get_serializer_class()(instance = new_user, context=context)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers=headers)
