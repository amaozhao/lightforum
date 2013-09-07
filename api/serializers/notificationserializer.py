from django.contrib.auth.models import User

from rest_framework import serializers

from notify.models import Notification

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')

class NotificationSerializer(serializers.ModelSerializer):
    owner = serializers.RelatedField(read_only = True)
    member = MemberSerializer(many=True)
    topic_id = serializers.SerializerMethodField('get_topic_id')
    topic_title = serializers.SerializerMethodField('get_topic_title')
    member_count = serializers.SerializerMethodField('get_member_count')

    def get_topic_id(self, obj):
        try:
            return obj.topic.id
        except:
            return ''
        
    def get_topic_title(self, obj):
        try:
            return obj.topic.title
        except:
            return ''
    
    def get_member_count(self, obj):
        try:
            return obj.member.count()
        except:
            return 0
    
    class Meta:
        model = Notification
        fields = ('id', 'owner', 'member', 'topic_id', 'member_count', 'topic_title' )
