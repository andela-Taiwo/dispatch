.PHONY: help setup fmt lint typecheck test check dev-web

help: ## list targets
	@grep -E '^[a-z-]+:.*## ' Makefile | awk -F ':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

setup: ## install locked server and web dependencies
	cd server && npm ci
	cd web && npm ci

fmt: ## format the server code
	cd server && npm run --silent format

lint: ## check formatting
	cd server && npm run --silent format:check

typecheck: ## strict type checks, server and web
	cd server && npm run --silent typecheck
	cd web && npm run --silent typecheck

test: ## run server and web tests
	cd server && npm test --silent
	cd web && npm test --silent

check: lint typecheck test ## everything

dev-web: ## run the web app on :5173
	cd web && npm run dev
