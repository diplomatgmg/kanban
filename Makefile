.PHONY: help

help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

up: ## compose up
	docker compose up --build -d
.PHONY: up

down: ## compose down
	docker compose down
.PHONY: down

front: ## Запуск electron
	cd frontend && npm run start
.PHONY: front
