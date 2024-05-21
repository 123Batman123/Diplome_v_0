from django.contrib.auth.models import User
from djoser.serializers import UserCreateSerializer, TokenSerializer
from rest_framework import serializers

from .models import File
from .utils import seconds_since_epoch

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

        # Get original file name
        original_name = file.name

        # Split the original file name to get the name and extension
        name_parts = original_name.rsplit('.', 1)
        if len(name_parts) == 2:
            name, extension = name_parts
        else:
            name = name_parts[0]
            extension = ''  # No extension

        # If there's no extension, add a default one
        if not extension:
            extension = 'bin'

        # Create a unique name using the current timestamp
        unique_name = f"{seconds_since_epoch()}_{name}.{extension}"
        validated_data['name'] = unique_name
        validated_data['file'].name = unique_name

        return super(FileWriteSerializer, self).create(validated_data)

# class FileSerializer(serializers.ModelSerializer):
#     """Сериализатор для таблицы File"""
#     creator = serializers.HiddenField(default=serializers.CurrentUserDefault())
#
#     class Meta:
#         model = File
#         fields = ('id', 'creator', 'file', 'name', 'size', 'data_created', 'date_download', 'comment', 'hash')
#             # ('name', 'file', 'creator')
#
#     def create(self, validated_data):
#         """
#         Для автоматического создания поля size
#         """
#         # name = validated_data['name']
#
#         file = validated_data['file']
#         validated_data['size'] = file.size
#         validated_data['name'] = str(seconds_since_epoch()) + file.name
#
#         # hash = hashlib.sha256(file.read()).hexdigest()
#         # validated_data['hash'] = hash + date_now
#         # date_now = str(seconds_since_epoch())
#         # validated_data['data_created'] = date_now
#
#         return super(FileSerializer, self).create(validated_data)

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
