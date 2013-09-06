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

from forum.models import Topic
from friends.models import FriendShip

class SimpleTopicSerializer(serializers.ModelSerializer):
    created = serializers.SerializerMethodField('get_created')
    
    def get_created(self, obj):
        print obj.created
        return timesince(obj.created)
    class Meta:
        model = Topic
        fields = ('id', 'title', 'created',)
        read_only_fields = ('id',)

class TopicSerializer(serializers.ModelSerializer):
    author = serializers.RelatedField(read_only = True)
    author_id = serializers.SerializerMethodField('get_author_id')
    author_fans = serializers.SerializerMethodField('get_author_fans')
    author_followings = serializers.SerializerMethodField('get_author_followings')
    can_following = serializers.SerializerMethodField('get_can_following')
    following = serializers.SerializerMethodField('get_following')
    markdown = serializers.SerializerMethodField('get_markdown')
    cut_markdown = serializers.SerializerMethodField('get_cut_markdown')
    editable = serializers.SerializerMethodField('get_editable')
    avatar = serializers.SerializerMethodField('get_avatar')
    addcommentavatar = serializers.SerializerMethodField('get_addcommentavatar')
    commentable = serializers.SerializerMethodField('get_commentable')
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
    
    def get_addcommentavatar(self, obj):
        try:
            path = "%s" % (hashlib.md5(force_bytes(self.context['view'].request.user.email)).hexdigest())
            return 'http://www.gravatar.com/avatar/' + path
        except:
            return 'http://www.gravatar.com/avatar/'
    
    def get_commentable(self, obj):
        return self.context['view'].request.user.is_authenticated()
        
    def get_cut_markdown(self,obj):
        markdown = Truncator(obj.get_content()).words(40, html=True, truncate=' ...')
        if markdown == obj.get_content():
            return markdown
        return Truncator(obj.get_content()).words(40, html=True, truncate=' ...')
    
    class Meta:
        model = Topic
        fields = ('id', 'author', 'author_id', 'author_fans', 'author_followings',
                  'title', 'content', 'following', 'can_following',
                  'markdown', 'cut_markdown', 'editable', 
                  'avatar', 'addcommentavatar', "commentable",
                  'created', 'updated')
        read_only_fields = ('id', )