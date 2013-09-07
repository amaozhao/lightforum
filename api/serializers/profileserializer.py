from rest_framework import serializers

from profiles.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField('get_user')

    def get_user(self, obj):
        try:
            return obj.user
        except:
            return ''
    class Meta:
        model = Profile
        fields = ('user', 'gender', 'qq', 'weibo', )
