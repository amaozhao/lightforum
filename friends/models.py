#! -*- coding:utf-8 -*-
from django.contrib.auth.models import User
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

class FriendShipManager(models.Manager):
    
    def get_following(self, user):
        """Get the `user's following users."""
        return User.objects.filter(to_user__from_user=user)
    
    def get_followed(self, user):
        """Get the `user's followed users."""
        return User.objects.filter(from_user__to_user=user)

class FriendShip(models.Model):
    """ Model to represent Friendships """
    to_user = models.ForeignKey(User, related_name='to_user')
    from_user = models.ForeignKey(User, related_name='from_user')
    created = models.DateTimeField(auto_now_add = True)

    objects = FriendShipManager()

    class Meta:
        verbose_name = _('Friend')
        verbose_name_plural = _('Friends')
        unique_together = ('from_user', 'to_user')

    def __unicode__(self):
        return "User #%s is following #%s" % (self.from_user, self.to_user)

    def save(self, *args, **kwargs):
        # Ensure users can't be friends with themselves
        if self.to_user == self.from_user:
            raise ValidationError("Users cannot be friends with themselves.")
        super(FriendShip, self).save(*args, **kwargs)