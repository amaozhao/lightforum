#! -*- coding:utf-8 -*-
from django.contrib.auth.decorators import login_required
from django.utils.translation import ugettext_lazy as _
from django.utils.decorators import method_decorator
from django.views.generic.edit import BaseUpdateView
from django.http.response import HttpResponseForbidden, HttpResponse
from django.contrib.auth.models import User

from friends.models import FriendShip

class Action(BaseUpdateView):
    
    def get(self, request, *args, **kwargs):
        return HttpResponseForbidden()
    
    def post(self, request, *args, **kwargs):
        to_user = request.POST.get('to_user', None)
        to_user = User.objects.get(pk = to_user)
        from_user = request.user
        relation = FriendShip.objects.filter(from_user = from_user, to_user = to_user).exists()
        if relation:
            FriendShip.objects.get(from_user = from_user, to_user = to_user).delete()
            return HttpResponse(_('follow'))
        else:
            FriendShip.objects.create(from_user = from_user, to_user = to_user)
            return HttpResponse(_('following'))
        
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(Action, self).dispatch(*args, **kwargs)    
action = Action.as_view()