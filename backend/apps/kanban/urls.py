from django.urls.conf import path

from apps.kanban.views import TestView

urlpatterns = [
    path("test", TestView.as_view())
]
