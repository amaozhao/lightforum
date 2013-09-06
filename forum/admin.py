from django.contrib import admin

from forum.models import Topic

class TopicAdmin(admin.ModelAdmin):
    model = Topic
    
admin.site.register(Topic, TopicAdmin)