from django.contrib import admin
from .models import Product, Image



@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'image')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'user')
    list_filter = ('user',)