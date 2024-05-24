import os
import shutil

from django.conf import settings

from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User

from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from backend_diplom.settings import BASE_DIR
from .models import File
from .serializers import FileReadSerializer, FileWriteSerializer, UserSerializer
from .utils import seconds_since_epoch

from pathlib import Path

from django.utils.encoding import iri_to_uri
path_2 = Path(__file__).resolve().parent.parent

# Create your views here.

class UserListView(generics.ListAPIView):
    """
        View для получения всех Пользователей
    """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = (IsAdminUser,)

class UserDetailView(APIView):
    """
        View для удаления и изменения значения признака «администратор» Пользователя
    """
    permission_classes = (IsAdminUser,)

    def delete(self, request, pk, format=None):
        user = get_object_or_404(User, pk=pk)
        # Удалить пользователя и его файлы
        user_directory = os.path.join(settings.MEDIA_ROOT, f'user_{user.id}')
        if os.path.exists(user_directory):
            shutil.rmtree(user_directory)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk, format=None):
        user = get_object_or_404(User, pk=pk)
        user.is_staff = not user.is_staff
        user.save()
        return Response(status=status.HTTP_200_OK)

class UserFileListView(APIView):
    """
        View для получения файлов конкретного Пользователя
    """
    permission_classes = [IsAdminUser]

    def get(self, request, user_id, format=None):
        user = get_object_or_404(User, id=user_id)
        files = File.objects.filter(creator=user)
        serializer = FileReadSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        user = self.request.user
        files = File.objects.filter(creator=user).order_by('-data_created')
        return files

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FileReadSerializer
        return FileWriteSerializer

    def list(self, request, *args, **kwargs):
        user = self.request.user
        files = self.get_queryset()
        serializer = self.get_serializer(files, many=True)
        data = {
            'isAdmin': user.is_staff,
            'files': serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)


#TODO Все настройки для files static
# def index(request, *args, **kwargs):
#     return render(request, 'new.html')