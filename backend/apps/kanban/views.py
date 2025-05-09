from rest_framework.views import APIView
from rest_framework.response import Response


class TasksView(APIView):
    def get(self, request, **kwargs):
        data = [{
            "id": num,
            "title": f"Тестовая задача {num}",
            "description": f"Описание задачи {num}"
        } for num in range(1, 6)]

        return Response(data)