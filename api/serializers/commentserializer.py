import hashlib
try:
    from django.utils.encoding import force_bytes
except ImportError:
    force_bytes = str
try:
    from urllib.parse import urlencode
except ImportError:
    from urllib import urlencode
from django.utils.text import Truncator
from django.utils.timesince import timesince

from rest_framework import serializers

from comments.models import Comment
from friends.models import FriendShip

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.RelatedField(read_only = True)
    author_id = serializers.SerializerMethodField('get_author_id')
    author_fans = serializers.SerializerMethodField('get_author_fans')
    author_followings = serializers.SerializerMethodField('get_author_followings')
    can_following = serializers.SerializerMethodField('get_can_following')
    following = serializers.SerializerMethodField('get_following')
    markdown = serializers.SerializerMethodField('get_markdown')
    editable = serializers.SerializerMethodField('get_editable')
    avatar = serializers.SerializerMethodField('get_avatar')
    created = serializers.SerializerMethodField('get_created')
    updated = serializers.SerializerMethodField('get_updated')
    
    def get_author_id(self, obj):
        return obj.author.id
    
    def get_author_fans(self, obj):
        return FriendShip.objects.get_followed(obj.author).count()
    
    def get_author_followings(self, obj):
        return FriendShip.objects.get_following(obj.author).count()
    
    def get_can_following(self, obj):
        user = self.context['view'].request.user
        return user.is_authenticated() and user.id is not obj.author.id
    
    def get_following(self, obj):
        try:
            return FriendShip.objects.filter(from_user = self.context['view'].request.user, 
                                         to_user = obj.author).exists()
        except:
            return False
    
    def get_created(self, obj):
        print obj.created
        return timesince(obj.created)
    
    def get_updated(self, obj):
        return timesince(obj.updated)
    
    def get_markdown(self, obj):
        return obj.get_content()

    def get_editable(self, obj):
        return obj.author == self.context['view'].request.user
    
    def get_avatar(self, obj):
        path = "%s" % (hashlib.md5(force_bytes(obj.author.email)).hexdigest())
        return 'http://www.gravatar.com/avatar/' + path
        
    class Meta:
        model = Comment
        fields = ('id', 'author',
                  'author_id', 'author_fans', 'author_followings',
                  'following', 'can_following',
                  'content', 'markdown', 'editable', 'avatar', 'created', 'updated')
        read_only_fields = ('id',)