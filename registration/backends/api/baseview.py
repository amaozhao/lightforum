from django.views.generic.base import TemplateResponseMixin

from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response

class BaseView(TemplateResponseMixin, ModelViewSet):
    """
    A registration backend which implements the simplest possible
    workflow: a user supplies a username, email address and password
    (the bare minimum for a useful account), and is immediately signed
    up and logged in).
    """

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

    def get(self, request, *args, **kwargs):
        return Response({'done': 'success'}, status=HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        return Response({'done': 'success'}, status=HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        return Response({'done': 'success'}, status=HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        return Response({'done': 'success'}, status=HTTP_400_BAD_REQUEST)
