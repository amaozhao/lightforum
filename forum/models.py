from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User

from markdown import markdown

class Topic(models.Model):
    author = models.ForeignKey(User, related_name = 'topics')
    title = models.CharField(_('Title'), max_length = 255)
    content = models.TextField(_('Content'))
    featured = models.BooleanField(_('featured'), default=False)
    created = models.DateTimeField(_('created'), auto_now_add = True)
    updated = models.DateTimeField(_('updated'), auto_now = True)
    
    def __unicode__(self):
        return self.title
    
    def get_content(self):
        return markdown(self.content, extensions=['coderlight'])
    
    class Meta:
        app_label = 'forum'
        ordering = ['-updated',]
        get_latest_by = 'created'
        verbose_name = _('topic')
        verbose_name_plural = _('topics')
