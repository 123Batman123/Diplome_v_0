# Дипломный проект по профессии «Fullstack-разработчик на Python»
## Облачное хранилище My Cloud
### [Задание к диплому...](https://github.com/netology-code/fpy-diplom/blob/main/README.md)
## FRONTEND
# Дополнительные библиотеки:
1. react-hook-form [Документация](https://react-hook-form.com/)
2. react-query [Документация](https://tanstack.com/query/latest/docs/framework/react/overview)
3. axios [Документация](https://axios-http.com/ru/docs/intro)
4. clipboard-polyfill [Документация](https://www.npmjs.com/package/clipboard-polyfill)

# Инструкции по сборке и подготовке артефактов фронтенда

## Настройка .env

В корневом каталоге фронтенд создать файл .env
В этом файле прописать:

```
VITE_BASE_URL=http://ваш_домен/
```

## Установка зависимостей
Для начала нужно установить все необходимые зависимости. Для этого выполните следующую команду:
```
npm install
```
## Сборка проекта
Перед сборкой убедитесь, что у вас в поекте присутствует файл .env:
```
VITE_BASE_URL=http://ваш_домен в моем случае 127.0.0.1:8000
```
Чтобы собрать проект, используйте следующую команду:
```
npm run build
```
## Результаты сборки
После успешной сборки, все артефакты фронтенда будут находиться в папке dist. Содержимое папки dist необходимо поместить в папку staticfiles Django проекта.