from django.db import models


class Task(models.Model):
    title = models.CharField("Название", max_length=64)
    description = models.TextField()
