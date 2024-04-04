from django.contrib import admin
from .models import * 

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'phone', 'codigo', 'date_joined', 'role', 'is_active')
    search_fields = ('first_name', 'last_name', 'phone', 'email', 'role')
    list_filter = ('date_joined', 'role', 'is_active')
    ordering = ('-date_joined',)
    list_per_page = 10

    class Meta:
        model = User
        fields = '__all__'

admin.site.register(User, UserAdmin)
