from django.contrib.auth.models import User
import hashlib
try:
    from django.utils.encoding import force_bytes
except ImportError:
    force_bytes = str
try:
    from urllib.parse import urlencode
except ImportError:
    from urllib import urlencode

from rest_framework import serializers
from comments.models import Comment
from friends.models import FriendShip

class SimpleUserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField('get_avatar')
    is_authenticated = serializers.SerializerMethodField('get_is_authenticated')
    notifications = serializers.SerializerMethodField('get_notifications')
    
    def get_avatar(self, obj):
        try:
            path = "%s" % (hashlib.md5(force_bytes(obj.email)).hexdigest())
            return 'http://www.gravatar.com/avatar/' + path
        except:
            return 'http://www.gravatar.com/avatar/'
    
    def get_topiccount(self, obj):
        return obj.topics.count()
    
    def get_notifications(self, obj):
        try:
            return obj.notifications.filter(unread = True).count()
        except:
            return 0
    
    def get_is_authenticated(self, obj):
        return self.context['view'].request.user.is_authenticated()
   
    class Meta:
        model = User
        fields = ('id', 'username', 
                  'avatar', 'is_authenticated', 'notifications',
        )
        read_only_fields = ('id', 'username', )

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField('get_avatar')
    topiccount = serializers.SerializerMethodField('get_topiccount')
    commentcount = serializers.SerializerMethodField('get_commentcount')
    gender = serializers.SerializerMethodField('get_gender')
    fans = serializers.SerializerMethodField('get_fans')
    following = serializers.SerializerMethodField('get_following')
    is_following = serializers.SerializerMethodField('get_is_following')
    is_followed = serializers.SerializerMethodField('get_is_followed')
    signature = serializers.SerializerMethodField('get_signature')
    
    def get_avatar(self, obj):
        path = "%s" % (hashlib.md5(force_bytes(obj.email)).hexdigest())
        return 'http://www.gravatar.com/avatar/' + path
    
    def get_topiccount(self, obj):
        return obj.topics.count()
    
    def get_commentcount(self, obj):
        return Comment.objects.filter(author = obj).count()
    
    def get_gender(self, obj):
        return obj.get_profile().gender
    def get_fans(self, obj):
        return obj.to_user.count()
    def get_following(self, obj):
        return obj.from_user.count()
    def get_is_following(self, obj):
        try:
            return FriendShip.objects.filter(from_user = self.context['view'].request.user, to_user = obj).exists()
        except:
            return False
    def get_is_followed(self, obj):
        try:
            return FriendShip.objects.filter(from_user = obj, to_user = self.context['view'].request.user).exists()
        except:
            return False
    def get_signature(self, obj):
        return ''

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 
                  'avatar', 'topiccount', 'commentcount', 'gender', 
                  'fans', 'following', 'signature',
                  'is_following', 'is_followed'
        )
        read_only_fields = ('id', 'username', 'email', )