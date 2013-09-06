#! -*- coding:utf-8 -*-
'''
Created on 2013年8月12日

@author: amaozhao
'''
from django.contrib import admin

from friends.models import FriendShip

class FriendShipAdmin(admin.ModelAdmin):
    model = FriendShip
    
    
admin.site.register(FriendShip, FriendShipAdmin)