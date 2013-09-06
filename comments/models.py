from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from forum.models import Topic

from markdown import markdown

class Comment(models.Model):
    author = models.ForeignKey(User, related_name = 'comments')
    topic = models.ForeignKey(Topic, related_name = 'comments')
    content = models.TextField(_('content'))
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now = True)
    
    def __unicode__(self):
        return self.content[:40]
    
    def get_content(self):
        return markdown(self.content, extensions=['coderlight'])
    
    class Meta:
        ordering = ['created']
        get_latest_by = 'created'
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
