SHELL := /bin/bash

# Configurable variables
VITE_DEV_SERVER_URL ?= http://localhost:5173
MAKE_WAIT_TIMEOUT ?= 60

# Project Makefile for common tasks (Laravel + Vite + Node)
# Usage: make <target>

.PHONY: help install deps env key db migrate start start-backend start-frontend test types lint build clean stop doctor stop-silent

help:
	@echo "Available targets:"
	@echo "  install           Install PHP (composer) and Node dependencies"
	@echo "  deps              Install only dependencies (composer & npm)"
	@echo "  env               Create .env from .env.example if missing"
	@echo "  key               Generate Laravel app key"
	@echo "  db                Create SQLite DB file"
	@echo "  migrate           Run database migrations"
	@echo "  start             Start both backend and vite frontend (concurrently)"
	@echo "  start-backend     Start Laravel backend only"
	@echo "  start-frontend    Start Vite frontend only"
	@echo "  test              Run PHP tests with Pest"
	@echo "  types             Run TypeScript typecheck"
	@echo "  lint              Run ESLint + Prettier (format check)"
	@echo "  build             Build production assets (vite build)"
	@echo "  clean             Remove node_modules and vendor (use with caution)"

install: deps env key db migrate

deps:
	@echo "Installing composer and node modules..."
	@composer install --no-interaction --prefer-dist
	@npm install --no-audit --no-fund

env:
	@if [ -f .env ]; then \
		echo ".env already exists"; \
	else \
		cp .env.example .env && echo "Created .env from .env.example"; \
	fi

key:
	@php artisan key:generate

db:
	@mkdir -p database
	@touch database/database.sqlite
	@echo "Touched database/database.sqlite"

migrate:
	@php artisan migrate --force

start: start-backend start-frontend

start-backend:
	@echo "Starting Laravel backend (php artisan serve --host=0.0.0.0 --port=8000)"
	@php artisan serve --host=0.0.0.0 --port=8000

start-frontend:
	@echo "Starting Vite frontend (vite --host 0.0.0.0)"
	@vite --host 0.0.0.0

start-bg:
	@echo "Starting both servers in background using npx concurrently"
	@$(MAKE) create-hot
	@npx concurrently -k "npm:dev:backend" "npm:dev:frontend" --names=backend,vite --kill-others &

# start-wait: start both servers in background and wait until ports are responsive
.PHONY: start-wait
start-wait:
	@echo "Starting backend and frontend in background and waiting for them to be ready..."
	@$(MAKE) create-hot
	@bash -lc '\
npx concurrently -k "npm:dev:backend" "npm:dev:frontend" --names=backend,vite --kill-others & \
CROOT=$$!; echo "concurrently pid: $$CROOT"; \
TIMEOUT=$(MAKE_WAIT_TIMEOUT); START=$$(date +%s); \
while :; do \
	if curl -s --head --max-time 2 http://127.0.0.1:8000 >/dev/null 2>&1; then BACKEND_OK=1; else BACKEND_OK=0; fi; \
	if curl -s --head --max-time 2 $(VITE_DEV_SERVER_URL) >/dev/null 2>&1; then FRONTEND_OK=1; else FRONTEND_OK=0; fi; \
	if [ $$BACKEND_OK -eq 1 -a $$FRONTEND_OK -eq 1 ]; then echo "Both backend and frontend are responsive."; break; fi; \
	_NOW=$$(date +%s); if [ $$((_NOW - START)) -ge $$TIMEOUT ]; then echo "Timeout waiting for servers after $$TIMEOUT seconds."; exit 1; fi; \
	sleep 1; \
done; \
	# Re-create public/hot to ensure the canonical Vite URL is written (in case some process altered it)
	$(MAKE) create-hot; \
	echo "Servers are up (backend: http://127.0.0.1:8000, vite: $(VITE_DEV_SERVER_URL))"'

.PHONY: create-hot
create-hot:
	@mkdir -p public
	@echo "Creating public/hot -> $(VITE_DEV_SERVER_URL)"
	@printf "%s\n" "$(VITE_DEV_SERVER_URL)" > public/hot

.PHONY: stop
stop:
	@echo "Stopping servers listening on ports 8000 and 5173 (if any)..."
	@set -e; \
	for port in 8000 5173; do \
		PIDS=$$(lsof -ti :"$$port" || true); \
		if [ -n "$$PIDS" ]; then \
			echo "Killing processes on port $$port: $$PIDS"; \
			kill $$PIDS || true; \
		else \
			echo "No process on port $$port"; \
		fi; \
	done; \
	echo "Done."

.PHONY: stop-silent
stop-silent:
	@set -e; \
	for port in 8000 5173; do \
		PIDS=$$(lsof -ti :"$$port" || true); \
		if [ -n "$$PIDS" ]; then \
			kill $$PIDS >/dev/null 2>&1 || true; \
		fi; \
	done;

.PHONY: doctor
doctor:
	@echo "Checking development environment..."
	@if [ -f public/hot ]; then \
		echo "public/hot exists:"; cat public/hot; \
	else \
		echo "public/hot is missing"; \
	fi
	@echo "Checking ports and endpoints..."
	@bash -lc '\
	if curl -s --head --max-time 2 http://127.0.0.1:8000 >/dev/null 2>&1; then echo "Backend (http://127.0.0.1:8000) -> OK"; else echo "Backend -> NOT responding"; fi; \
	if curl -s --head --max-time 2 $(VITE_DEV_SERVER_URL) >/dev/null 2>&1; then echo "Vite ($(VITE_DEV_SERVER_URL)) -> OK"; else echo "Vite -> NOT responding"; fi; \
	if curl -s --max-time 2 $(VITE_DEV_SERVER_URL)/@vite/client >/dev/null 2>&1; then echo "/@vite/client -> OK"; else echo "/@vite/client -> FAILED"; fi; \
	echo "Processes listening on ports:"; lsof -i :8000 -i :5173 || true'

test:
	@./vendor/bin/pest --colors

types:
	@npm run types

lint:
	@npm run lint || true

build:
	@npm run build

clean:
	@read -p "Remove node_modules and vendor directories? [y/N] " yn; \
	case $$yn in \
		y|Y) rm -rf node_modules vendor && echo "Removed node_modules and vendor";; \
		*) echo "Aborted";; \
	esac
