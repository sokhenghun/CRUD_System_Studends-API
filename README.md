# Laravel CRUD with React Frontend

**Repository:** [github.com/sokhenghun/CRUD_System_Studends-API](https://github.com/sokhenghun/CRUD_System_Studends-API)

This project is fully scaffolded in two parts:

- `backend-laravel`: Laravel API for Student CRUD
- `frontend-react`: React app for create/read/update/delete

## Backend Setup (Laravel)

```bash
cd backend-laravel
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

API base URL: `http://127.0.0.1:8000/api`

## Frontend Setup (React)

```bash
cd frontend-react
cp .env.example .env
npm install
npm run dev
```

Frontend URL: `http://127.0.0.1:5173`

## Implemented CRUD Endpoints

- `GET /api/students`
- `POST /api/students`
- `GET /api/students/{id}`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`

## Student Fields

- `name` (required)
- `email` (required, unique)
- `phone` (optional)
- `course` (required)
- `year_level` (required, 1-5)

## Author

**sokhenghun** · [vindal554@gmail.com](mailto:vindal554@gmail.com)
