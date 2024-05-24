from django.contrib.auth.models import User
from django.db.models import Sum
from djoser.serializers import UserCreateSerializer, TokenSerializer
from rest_framework import serializers

from .models import File
from .utils import seconds_since_epoch

class UserSerializer(serializers.ModelSerializer):
    """
        Сериализатор для получения всех пользователей
    """
    total_files = serializers.SerializerMethodField()
    total_size = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'is_staff', 'total_files', 'total_size')

    def get_total_files(self, obj):
        """
            Колличество файлов
        """
        return File.objects.filter(creator=obj).count()

    def get_total_size(self, obj):
        """
            Общий размер всех файлов у Пользовтаеля
        """
        return File.objects.filter(creator=obj).aggregate(total_size=Sum('size'))['total_size'] or 0

class FileReadSerializer(serializers.ModelSerializer):
    """Сериализатор для чтения данных из таблицы File"""
    # creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = File
        fields = ('id', 'name', 'size', 'data_created', 'date_download', 'comment', 'hash')

class FileWriteSerializer(serializers.ModelSerializer):
    """Сериализатор для таблицы File"""
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = File
        fields = ('id', 'creator', 'name', 'file', 'size', 'data_created', 'date_download', 'comment', 'hash')

    def create(self, validated_data):
        """
        Для автоматического создания поля size и добавления расширения, если его нет
        """
        file = validated_data['file']
        validated_data['size'] = file.size

        original_name = file.name

        name_parts = original_name.rsplit('.', 1)
        if len(name_parts) == 2:
            name, extension = name_parts
        else:
            name = name_parts[0]
            extension = ''  # No extension

        if not extension:
            extension = 'bin'

        unique_name = f"{seconds_since_epoch()}_{name}.{extension}"
        validated_data['name'] = unique_name
        validated_data['file'].name = unique_name

        return super(FileWriteSerializer, self).create(validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        print(self.context)
        if self.context['request'].method == 'GET':
            representation.pop('file', None)
        return representation

class CustomUserCreateSerializer(UserCreateSerializer):
    """
    Кстомный сериализатор для добавления поля first_name оно же полное имя пользователя
    """
    email = serializers.EmailField()

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('username', 'email', 'password', 'first_name',)

    def validate_email(self, value):
        """
        Валидация на уникальность email в базе данных
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value

class CustomTokenSerializer(TokenSerializer):
    is_staff = serializers.BooleanField(source='user.is_staff')

    class Meta(TokenSerializer.Meta):
        fields = ('auth_token', 'is_staff')
