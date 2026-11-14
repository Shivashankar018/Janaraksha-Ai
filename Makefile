# JanaRaksha AI developer commands. Run `make help` for the list.
PYTHON ?= python3
PORT ?= 8000

.PHONY: help build check serve test links clean

help: ## Show the commands
	@grep -E '^[a-z]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  make %-8s %s\n", $$1, $$2}'

build: ## Build dist/index.html
	$(PYTHON) scripts/build.py

check: ## Build and run the JavaScript syntax check (needs Node.js)
	$(PYTHON) scripts/build.py --check

serve: build ## Build and serve on http://localhost:8000
	$(PYTHON) -m http.server $(PORT) --directory dist

test: ## Build and run the end-to-end tests
	$(PYTHON) -m pytest

links: ## Check the links in the Markdown files
	$(PYTHON) scripts/check_links.py

clean: ## Delete build and test output
	rm -rf dist build .pytest_cache test-results playwright-report
