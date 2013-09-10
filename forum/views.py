from django.views.generic import TemplateView

class Home(TemplateView):
    template_name = 'index.html'
    
    def get_context_data(self, **kwargs):
        context = super(Home, self).get_context_data(**kwargs)
        if self.request.user.is_authenticated():
            context['notifications'] = self.request.user.notifications.filter(unread=True).count()
            context['avatar'] = self.request.user.get_profile().get_avatar()
        return context

home = Home.as_view()