from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

from forum.models import Topic
from comments.models import Comment

class Notification(models.Model):
    owner = models.ForeignKey(User, related_name = 'notifications')
    topic = models.ForeignKey(Topic, related_name = 'notifications')
    member = models.ManyToManyField(User, related_name = 'notification_from')
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now = True)
    unread = models.BooleanField(default = True, editable = False)
    
    class Meta:
        db_table = 'notification'
        ordering = ('-updated', )
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        unique_together = ("owner", "topic")
        
    def __unicode__(self):
        return str(self.pk)
    
    def set_unread(self):
        self.unread = True
        self.save()
        
    def set_read(self):
        self.member.clear()
        self.unread = False
        self.save()
        
@receiver(post_save, sender = Comment)
def notice_for_comment(instance, sender, **kwargs):
    topic = instance.topic
    if instance.author != topic.author:
        notice, created = Notification.objects.get_or_create(owner = topic.author, topic = topic)
        notice.member.add(instance.author)
        if not created:
            notice.set_unread()
    for comment in Comment.objects.filter(topic = topic).exclude(author = instance.author):
        notice, created = Notification.objects.get_or_create(owner = comment.author, topic = topic)
        notice.member.add(instance.author)
        if not created:
            notice.set_unread()
