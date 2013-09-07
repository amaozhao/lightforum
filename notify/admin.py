from django.contrib import admin

from notify.models import Notification

class NOtificationAdmin(admin.ModelAdmin):
    model = Notification
    
admin.site.register(Notification, NOtificationAdmin)