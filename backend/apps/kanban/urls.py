from django.urls.conf import path

from apps.kanban.views import TestView, TasksView

urlpatterns = [
    path("test", TestView.as_view()),
    path("tasks", TasksView.as_view()),
]
