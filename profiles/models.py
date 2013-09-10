from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

import hashlib
try:
    from django.utils.encoding import force_bytes
except ImportError:
    force_bytes = str

GENDER_CHOICES = ((_('Male'), _('Male')), (_('Female'), _('Female')))

class Profile(models.Model):
    user = models.OneToOneField(User, verbose_name=_('user'), related_name='profile')
    gender = models.CharField(_('gender'), max_length=128, null=True, blank=True, choices=GENDER_CHOICES)
    qq = models.CharField(_('QQ Number'), max_length = 128, null = True, blank = True)
    weibo = models.CharField(_('WeiBo'), max_length = 128, null = True, blank = True)
    
    def get_avatar(self):
        try:
            path = "%s" % (hashlib.md5(force_bytes(self.user.email)).hexdigest())
            return 'http://www.gravatar.com/avatar/' + path
        except:
            return 'http://www.gravatar.com/avatar/'
    
    class Meta:
        db_table = "profiles"
        verbose_name = _('profile')
        verbose_name_plural = _('profiles')
        
@receiver(post_save, sender = User)
def profile_for_user(instance, sender, **kwargs):
    profile, created = Profile.objects.get_or_create(user = instance)
