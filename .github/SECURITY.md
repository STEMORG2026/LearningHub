# Security Policy

**Version:** 3.0.0
**Status:** Active
**Owner:** Architecture

## Scope

STEM-TUITION is a static web application (STEM education platform) that handles:
- Student contact information (name, phone, email) via contact forms
- WhatsApp integration for enrollment
- Future: authentication, progress tracking, payments

## Security Measures

This repository enforces security through:

- **Dependency Auditing**: `pnpm audit --audit-level high` in CI
- **Secret Scanning**: gitleaks in CI pipeline
- **Container Scanning**: Trivy scans in release pipeline (CRITICAL/HIGH only)
- **Supply Chain Security**: npm provenance, cosign-signed container images, CycloneDX SBOM generation
- **Content Security Policy**: Configured headers in production deployment
- **Input Validation**: Zod schemas for all user input (see `docs/policies/SECURITY.md`)

## Reporting a Vulnerability

If you find a security issue, please contact: gurungsajan0228@gmail.com

**For production deployment:**
A security.txt file is available at `/.well-known/security.txt`

## Security Policies

For full security rules, see [`docs/policies/SECURITY.md`](docs/policies/SECURITY.md).
