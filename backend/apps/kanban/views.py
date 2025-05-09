from rest_framework import generics

from apps.kanban.models import Task
from apps.kanban.serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    """
    Получение списка / создание задач
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Детальная информация о задачи / удаление задачи
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'