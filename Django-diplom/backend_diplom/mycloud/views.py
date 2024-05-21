import os
from django.conf import settings

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from backend_diplom.settings import BASE_DIR
from .models import File
from .serializers import FileReadSerializer, FileWriteSerializer
from .utils import seconds_since_epoch

from pathlib import Path

from django.utils.encoding import iri_to_uri
path_2 = Path(__file__).resolve().parent.parent

# Create your views here.

# class FileAPIView(generics.ListCreateAPIView):
#     """
#     Пока не активный, потом можно прикрутить к админу
#     """
#     queryset = File.objects.all()
#     serializer_class = FileSerializer
#     permission_classes = (IsAuthenticated, )

class FileAPIUpdate(generics.RetrieveUpdateAPIView):
    """
    Для чтения и обновления
    """
    queryset = File.objects.all()
    serializer_class = FileWriteSerializer
    permission_classes = (IsAuthenticated, )

class FileAPIDestroy(generics.RetrieveDestroyAPIView):
    """
    Для удаления
    """
    queryset = File.objects.all()
    serializer_class = FileWriteSerializer
    permission_classes = (IsAuthenticated, )

    def perform_destroy(self, instance):
        # Получаем путь к файлу
        file_path = instance.file.path
        # Вызываем базовый метод удаления из базы данных
        super(FileAPIDestroy, self).perform_destroy(instance)
        # Удаляем связанный файл
        if file_path:
            if os.path.isfile(file_path):
                os.remove(file_path)
        return Response(status=status.HTTP_204_NO_CONTENT)

#TODO ТЕСТОВЫЙ
class FilePath(APIView):
    def get(self, request, hash, format=None):
        print(hash)
        # queryset = File.objects.all()
        # a = queryset.filter(hash="2a81017916c1809b98c41d334d07196ed48eb94eded483c22cc3cec6f1c11b921712574583")
        # print(a.first().file)
        return Response({"path": "a"})

class FileDownloadView(APIView):
    """
    Класс для отдачи файла по запросу, не зарегистрированного пользователя
    """
    permission_classes = [AllowAny]
    def get(self, request, hash, format=None):
        file_obj = get_object_or_404(File, hash=hash)

        file_path = str(file_obj.file)
        file_name = str(file_obj.name)
        print('name', file_name, 'file_path', file_path)

        # Extract the extension from the file path if it exists
        expansion = file_name.split('.')[-1] if '.' in file_name else ''
        path_file_obj = os.path.join(settings.MEDIA_ROOT, file_path)

        if os.path.exists(path_file_obj):
            file_obj.date_download = seconds_since_epoch()
            file_obj.save()
            print('file_name', file_name, 'expansion', expansion)
            with open(path_file_obj, 'rb') as file:
                response = HttpResponse(file, content_type='application/force-download')

                if not expansion:
                    file_name += '.bin'

                response['Content-Disposition'] = f'attachment; filename=' + iri_to_uri(file_name)

                return response
        else:
            return HttpResponse("File not found", status=404)

class UserPostList(generics.ListCreateAPIView):
    """
    Класс представления для получения данных конкретного пользователя.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = (IsAuthenticated, ) #IsAdminUser

    def get_queryset(self):
        user = self.request.user
        files = File.objects.filter(creator=user).order_by('-data_created')
        return files

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FileReadSerializer  # Сериализатор без поля file
        return FileWriteSerializer  # Сериализатор с полем file

    def list(self, request, *args, **kwargs):
        user = self.request.user
        files = self.get_queryset()
        serializer = self.get_serializer(files, many=True)
        data = {
            'isAdmin': user.is_superuser,
            'files': serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)


#TODO Все настройки для files static
# def index(request, *args, **kwargs):
#     return render(request, 'new.html')