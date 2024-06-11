# Дипломный проект по профессии «Fullstack-разработчик на Python»
## Облачное хранилище My Cloud
### [Задание к диплому...](https://github.com/netology-code/fpy-diplom/blob/main/README.md)
## Описание структуры папок
- **/Django-diplom/** - Директория с исходным кодом бэкенда.
  - **backend_diplom/**
    - **/backend_diplom/** - Основной модуль Django проекта.
      - **settings.py** - Файл настроек Django.
      - **urls.py** - Файл маршрутизации URL.
      - **wsgi.py** - Точка входа для WSGI-сервера.
      - **asgi.py** - Точка входа для ASGI-сервера.
    - **/mycloud/** - Приложение внутри проекта.
      - **migrations/** - Папка с миграциями базы данных.
      - **models.py** - Модели данных.
      - **views.py** - Представления (контроллеры).
      - **serializers.py** - Сериализаторы данных.
      - **urls.py** - Маршрутизация URL для приложения.
      - **admin.py** - Административная панель для моделей.
      - **apps.py** - Конфигурация приложения.
      - **utils.py** - Вспомогательные функции, используемые в приложении.
    - **/staticfiles/** - Директория со статическими файлами
    - **manage.py** - Управляющий скрипт Django.
    - **README.md** - Инструкци по сборке Django static files бэкенда.
- **/frontend/** - Папка, содержащая frontend часть проекта.
  - **src/** - Исходные файлы frontend проекта.
    - **components/** - Компоненты пользовательского интерфейса.
      - **ui/** - Компоненты UI.
        - **FileItem/** - Компонент для отображения карточки отдельных файлов.
        - **FileManager/** - Компонент для отображения всех файлов пользователя + загрузка новых.
        - **AdminUserList/** - Компонент для отображения списка пользователя для Администратора.
        - **AdminUserList/** - Компонент для отображения списка файлов пользователей для Администратора.
        - **Footer/** - Компонент для отображения ижнего колонтитула.
        - **Header/** - Компонент для отображения навигационой панели + logo.
        - **Layout/** - Компонент для организации компонентов на странице.
        - **Logo/** - Логотип.
        - **Nav/** - Навигационная панель.
        - **PrivateRoute** - Компонент для защиты маршрутов.
    - **context** -  Cодержит все контексты React.
      - **AuthContext.tsx** - Контекст аутентификации.
    - **pages/** - Страницы проекта.
      - **LoginPage/** - Страница входа.
      - **MainPage/** - Страница основного контента.
      - **SignupPage/** - Страница регистрации.
    - **services/** -  Для хранения модулей, которые отвечают за взаимодействие с внешними источниками данных.
      - **API.ts** - Модуль для работы с API сервера.
    - **types/** - Для хранения типов TypeScrip.
      - **types.ts** - Описание типов TS.
    - **utils/** - Утилиты и вспомогательные функции, используемые в приложении.
      - **helperFunctions.ts** - Вспомогательные функции, используемые в приложении.
    - **App.tsx** - Основной компонент приложения, который служит точкой входа для рендеринга. Здесь задается структура и маршрутизация приложения.
    - **main.tsx** - Точка входа для React-приложения, здесь происходит рендеринг App в DOM.
  - **README.md** - Инструкции по сборке и подготовке артефактов фронтенда.

## **ОБЯЗАТЕЛЬНО!!! Перед началом развертывания проекта необходимо сделать следующее**
### [Настроить Frontend](frontend/README.md)
### [Настроить Backend](Django-diplom/backend_diplom/README.md)

# Развертывание проекта на reg.ru
### 1. На рег.ру закзать облачный сервер на Ubuntu.
### 2. Привязать к серверу ваш ssh ключ.
### 3. Запустить wsl если на windows, если на Linux просто открыть терминал.
### 4. Прописать в терминале команду:
```
ssh root@ip_вашего_сервера 
```
### 5. Указать пароль который пришел вам на почту.
### 6. Создадим пользователя:
```
adduser имя_пользователя
```
### 7. Назначим пользователя администратором:
```
usermod имя_пользователя -aG sudo
```
### 8. Переключим на этого пользователя:
```
su имя_пользователя
```
### 9. Переходим на рабочую директорию:
```
cd ~
```
### 10. Обновим пакетный менеджер:
```
sudo apt update
```
### 11. Установим необходимые пакеты:
```
sudo apt install python3-venv python3-pip postgresql nginx
```
### 12. Запустим nginx:
```
sudo systemctl start nginx
```
Убедимся что запустился nginx
```
sudo systemctl status nginx
```
### 13. Скачаем репозиторий GitHub:
```
git clone https_репозитория
```
### 14. Перейдем в папку репозитория где лежит manage.py:
```
cd название_проекта
```
### 15. Создадим БД. 
Переключимся на пользователя postgres:
```
sudo su postgres
```
Переключимся на psql
```
psql
```
Зададим пароль для postgres
```
ALTER USER postgres WITH PASSWORD 'ваш_пароль';
```
Создадим БД
```
CREATE DATABASE diplome_v_0; Или ваше название
```
Выйдем из qsql
```
\q
```
Выходим из под пользователя postgres
```
exit
```
### 16. Создадим .env на сервере:
Переходим в директории с Django проектом, там где находится файл manage.py
```
nano .env
```
Прописываем следующие параметры в файле .env
```
DEBUG=True(по умолчанию, потом поменять на False)
ALLOWED_HOSTS=localhost,127.0.0.1,ваш_ip
DB_NAME=название_вашей_БД
DB_HOST=localhost
DB_PORT=5432 (по умолчанию)
DB_USER=имя_пользователя
DB_PASSWORD=пароль_БД
```
### 17. Настроим виртуальное окружение:
В той же директории с manage.py
```
python3 -m venv env
```
Активировуем виртуальное окружение
```
source env/bin/activate
```
Утановим необходимые пакеты из requirements.txt
```
pip install -r requirements.txt
```
Выполним миграции:
```
python manage.py migrate
```
### 18. Соберем статические файлы:
```
python manage.py collectstatic
```
### 19. Запустим сервер:
```
python manage.py runserver 0.0.0.0:8000
```
В .env поменять DEBUG на False
```
DEBUG=False
```
### 20. Настроим gunicorn:
```
gunicorn backend_diplom.wsgi -b 0.0.0.0:8000
```
Создадим файл настроек gunicorn \
Переходим:
```
sudo nano /etc/systemd/system/gunicorn.service
```
Пропишем следующие настройки:
```
[Unit]
Description=gunicorn service
After=network.target

[Service]
User=zakhar
Group=www-data
WorkingDirectory=/home/zakhar/Diplome_v_0/Django-diplom/backend_diplom
ExecStart=/home/zakhar/Diplome_v_0/Django-diplom/backend_diplom/env/bin/gunicorn --access-logfile -\
    --workers 3 --bind unix:/home/zakhar/Diplome_v_0/Django-diplom/backend_diplom/backend_diplom/gunicorn.sock backend_diplom.wsgi:application

[Install]
WantedBy=multi-user.target
```
Зупстим:
```
sudo systemctl start gunicorn
```
```
sudo systemctl enable gunicorn
```
Проверим статус:
```
sudo systemctl status gunicorn
```
### 21. Настроим nginx:
Создадим файл с настройками:
```
sudo nano /etc/nginx/sites-available/diplom
```
Сами настройки:
```
server {
    listen 80;
    server_name 79.174.80.82;

    location /static/ {
        root /home/zakhar/Diplome_v_0/Django-diplom/backend_diplom;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/zakhar/Diplome_v_0/Django-diplom/backend_diplom/backend_diplom/gunicorn.sock;
    }
}
```
Делаем ссылку:
```
sudo ln -s /etc/nginx/sites-available/diplom /etc/nginx/sites-enabled
```
Остановим сервер:
```
sudo systemctl stop nginx
```
Запустим сервер:
```
sudo systemctl start nginx
```
Проверка статуса сервера:
```
sudo systemctl status nginx
```
**Откроем файл настроек nginx:**
```
sudo nano /etc/nginx/nginx.conf
```
Поменяем первое поле файла:
```
user www-data;
заменить на 
user имя_пользователя; В моем случае zakhar
```
### 22. Разрешим файрвол для Nginx:
```
sudo ufw allow 'Nginx Full'
```
 

## Особые примечания:
### Если какие то изменения в проекте:
Заливаем на сервер:
```
git pull
```
Не забываем сделать:
```
python manage.py collectstatic
```
Если в браузере не вступают изменения делаем:
```
sudo systemctl restart gunicorn
```
```
sudo systemctl restart nginx
```