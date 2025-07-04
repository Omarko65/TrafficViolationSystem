from django.contrib import admin
from .models import Officer, Violation, Profile
# Register your models here.

admin.site.register(Officer)
admin.site.register(Violation)
admin.site.register(Profile)