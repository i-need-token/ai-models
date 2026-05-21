.PHONY: install validate scrape build stats csv clean

install:
	npm install

validate:
	npm run validate

scrape:
	npm run scrape-all

build:
	npm run build

stats:
	npm run stats

csv:
	npm run export-csv

clean:
	rm -rf dist/ *.tsbuildinfo models.csv stats.json

lint:
	npm run lint

fmt:
	npx oxfmt --write .

fmt-check:
	npx oxfmt --check .

typecheck:
	npx tsc --noEmit

check: fmt-check lint typecheck validate
	@echo "All checks passed!"
