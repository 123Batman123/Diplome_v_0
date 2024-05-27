from django.contrib.auth.models import User
from django.db.models import Sum
from djoser.serializers import UserCreateSerializer, TokenSerializer
from rest_framework import serializers

from .models import File
from .utils import seconds_since_epoch

class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для получения всех пользователей.

    - total_files: количество файлов пользователя.
    - total_size: общий размер всех файлов пользователя.
    """
    total_files = serializers.SerializerMethodField()
    total_size = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'is_staff', 'total_files', 'total_size')

    def get_total_files(self, obj):
        """
        Возвращает количество файлов пользователя.

        Args:
            obj (User): объект пользователя.

        Returns:
            int: количество файлов пользователя.
        """
        return File.objects.filter(creator=obj).count()

    def get_total_size(self, obj):
        """
        Возвращает общий размер всех файлов пользователя.

        Args:
            obj (User): объект пользователя.

        Returns:
            int: общий размер файлов пользователя.
        """
        return File.objects.filter(creator=obj).aggregate(total_size=Sum('size'))['total_size'] or 0

class FileReadSerializer(serializers.ModelSerializer):
    """
    Сериализатор для чтения данных из таблицы File.

    - fields: перечисление полей модели File для чтения.
    """
    # creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = File
        fields = ('id', 'name', 'size', 'data_created', 'date_download', 'comment', 'hash')

class FileWriteSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания и обновления файлов в таблице File.

    - creator: скрытое поле, устанавливающее текущего пользователя.
    """
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = File
        fields = ('id', 'creator', 'name', 'file', 'size', 'data_created', 'date_download', 'comment', 'hash')

    def create(self, validated_data):
        """
        Создаёт объект File с автоматическим установлением поля size и добавлением расширения файла, если его нет.

        Args:
            validated_data (dict): валидированные данные для создания объекта File.

        Returns:
            File: созданный объект File.
        """
        file = validated_data['file']
        validated_data['size'] = file.size

        original_name = file.name

        name_parts = original_name.rsplit('.', 1)
        if len(name_parts) == 2:
            name, extension = name_parts
        else:
            name = name_parts[0]
            extension = ''

        if not extension:
            extension = 'bin'

        unique_name = f"{seconds_since_epoch()}_{name}.{extension}"
        validated_data['name'] = unique_name
        validated_data['file'].name = unique_name

        return super(FileWriteSerializer, self).create(validated_data)

    def to_representation(self, instance):
        """
        Возвращает представление объекта File, исключая поле file для GET запросов.

        Args:
            instance (File): объект File.

        Returns:
            dict: представление объекта File.
        """
        representation = super().to_representation(instance)
        print(self.context)
        if self.context['request'].method == 'GET':
            representation.pop('file', None)
        return representation

class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Кастомный сериализатор для создания пользователя с добавлением поля first_name.

    - email: обязательное поле email.
    """
    email = serializers.EmailField()

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('username', 'email', 'password', 'first_name',)

    def validate_email(self, value):
        """
        Проверяет уникальность email в базе данных.

        Args:
            value (str): email для проверки.

        Returns:
            str: проверенный email.

        Raises:
            serializers.ValidationError: если email уже существует.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value

class CustomTokenSerializer(TokenSerializer):
    """
    Кастомный сериализатор для добавления поля is_staff к токену.

    - is_staff: булево поле, указывающее является ли пользователь администратором.
    """
    is_staff = serializers.BooleanField(source='user.is_staff')

    class Meta(TokenSerializer.Meta):
        fields = ('auth_token', 'is_staff')
