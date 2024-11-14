# PokeAPI-task

A Pokedex application using PokeAPI allows users to browse a list of Pokémon, view detailed information on each, and filter and sort the list by type or name. Users can add Pokémon to a favorites list managed with Redux and view this list on a separate page. Built with TypeScript, React.js, and Next.js or Vite, the app focuses on performance, clean code, and responsive design.
 
Deploy: 

## Author

- [Pavel Gordienko](https://github.com/guz86)

## Setup and Running

- Use `node 22.x` or higher.
- Clone this repo: `$ git clone https://github.com/guz86/PokeAPI-task.git`.
- Go to downloaded folder: `$ cd pokeapi`.
- Install dependencies: `$ npm install`.
- Start server: `$ npm run start`.
- Now you can see web application to the address: `http://localhost:3000/`.

### Build

Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.


Dev mode
```bash
npm run dev
```

## Stack
- TypeScript
- React.js
- Next.js
- Redux Toolkit
- Tailwindcss
 

## Folder structure
app/
- favorites
- pokemon
 
features/
- favorites
- navbar
- pokemon
- pokemonCard
- pokemonList
- searchBar
- typeSelect
 
hooks/
store/

## Screenshots

![image](https://github.com/user-attachments/assets/6e31db3e-92f4-4c24-959d-b48ebafdcb68)

![image](https://github.com/user-attachments/assets/adc74da0-0fb0-4777-bafa-a896573629f3)

![image](https://github.com/user-attachments/assets/c0e605cc-451b-460a-a0ae-3900b2671106)



 
Покедекс с использованием PokeAPI
Описание
Создать приложение "Pokedex", которое позволяет просматривать список покемонов, загружать детали о каждом, а также фильтровать и сортировать список. Использовать публичное PokeAPI.
Основной функционал
Главная страница:
Отображение списка покемонов - фотография, имя, тип (infinite loading).
Поиск по имени.
Фильтрация по типам покемонов(огонь, вода, земля и т.д.).
Детальная страница покемона:
Показ детальной информации (имя, вес, рост, способности, фотография и базовые характеристики).
Redux:
Управление состоянием приложения:
Добавление покемона в избранное - отображение списка на отдельной страница
Удаление покемона из избранного 
Технические требования
TypeScript
React.js
Next.js или Vite
Redux Toolkit
Tailwindcss или SCSS
Оценочные параметры
Чистота кода(читаемость, форматирование - prettier + eslint).
Оптимизация и производительность(кеширование, избежание ненужных ререндеров).
TypeScript(типизация, интерфейсы и типы).
Архитектура и структура приложения(DRY, Redux, структура файлов).
UI и UX(респонсивность, реактивность).
Работа с данными и API(обработка ошибок, оптимизация запросов).

Ожидаемый результат
Приложение должно быть завершенным, с чистым и организованным кодом, оптимизированным для производительности и удобным для пользователя. После этого необходимо захостить приложение внутри github и пригласить пользователя makemesuffer.
