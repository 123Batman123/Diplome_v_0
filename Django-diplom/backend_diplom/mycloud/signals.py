from django.contrib.auth import user_logged_in
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.http import JsonResponse

# print('ffffffffffffffffffffffff')
# @receiver(pre_save, sender=User)
# def validate_email_unique(sender, instance, **kwargs):
#     existing_user = User.objects.filter(email=instance.email).first()
#     if existing_user and existing_user != instance:
#         raise ValidationError("This email is already in use.")
# @receiver(user_logged_in)
# def add_custom_data(sender, request, user, **kwargs):
#     # В этой функции вы можете добавить любую дополнительную информацию о пользователе в ответ.
#     data = {
#         'isAdmin': user.is_staff,
#         # Добавьте другие поля, которые вы хотите включить в ответ
#     }
#     print('ffffffffffffff', data)
#     return JsonResponse(data)