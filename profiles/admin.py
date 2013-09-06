from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from profiles.models import Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    
class UserAdmin(UserAdmin):
    inlines = (ProfileInline, )
    
admin.site.unregister(User)
admin.site.register(User, UserAdmin)