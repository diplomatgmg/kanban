from rest_framework.views import APIView
from rest_framework.response import Response

class TestView(APIView):
    def get(self, request, **kwargs):
        return Response({
            "data": "backend is work"
        })