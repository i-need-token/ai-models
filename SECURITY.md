# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by opening a [GitHub Security Advisory](https://github.com/i-need-token/ai-models/security/advisories/new).

Please do not report security vulnerabilities through public GitHub issues.

## Scope

This project is a data catalog — it contains YAML model data files, TypeScript type definitions, and scrape scripts. Security vulnerabilities in this context would include:

- Malicious code in scrape scripts that could compromise the build environment
- Supply chain vulnerabilities in dependencies
- Data integrity issues where model data is intentionally corrupted

Out of scope:

- Incorrect model pricing or capability data (report as a [bug](https://github.com/i-need-token/ai-models/issues/new?labels=bug&template=bug_report.md))
- Missing providers or models (report as a [provider request](https://github.com/i-need-token/ai-models/issues/new?labels=enhancement&template=provider_request.md))

## Response Time

We aim to acknowledge security reports within 48 hours and provide a fix within 7 days.
