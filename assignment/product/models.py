from django.db import models
from django.contrib.auth import get_user_model


user_model = get_user_model()


class Image(models.Model):
    user = models.ForeignKey(user_model, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products")


class Product(models.Model):
    title = models.CharField(max_length=200)
    files = models.ManyToManyField(Image, related_name="products")
    user = models.ForeignKey(user_model, on_delete=models.CASCADE, related_name="products")

    def __str__(self) -> str:
        return self.title


