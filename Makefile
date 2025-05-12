.PHONY: help

lint:
	cd frontend && npx eslint .

lint-fix:
	cd frontend && npx eslint . --fix

help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

front: ## Запуск electron
	cd frontend && npm run start
.PHONY: front

back: ## Запуск бекенда
	docker compose up --build -d
.PHONY: up

down: ## Остановка и удаление контейнеров
	docker compose down
.PHONY: down

mm: ## Создает миграции БД для бекенда
	docker compose exec backend python manage.py makemigrations
.PHONY: mm

migrate: ## Применяет миграции БД для бекенда
	docker compose exec backend python manage.py migrate
.PHONY: migrate

test:
	npm --prefix ./frontend test

test-coverage:
	npx --prefix ./frontend jest --coverage --config=./frontend/jest.config.js