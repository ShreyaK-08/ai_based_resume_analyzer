# Contributing to ResumeAI

This document explains how to set up the project for development, the contribution workflow, and what is expected in a pull request.

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/ai_based_analyzer.git
   cd ai_based_analyzer
   ```
3. Follow [docs/INSTALLATION.md](docs/INSTALLATION.md) to set up the `server/` and `client/` locally
4. Create your own `server/.env` from `server/.env.example` (you will need your own MongoDB URI and Groq API key)

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/short-bug-description
   ```
2. Make your changes in `server/` or `client/`
3. Run both the server and client locally and confirm existing functionality still works
4. Commit your changes (see [commit guidelines](#commit-message-guidelines))
5. Push to your fork and open a pull request against `main`

## Commit Message Guidelines

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add pagination to analysis history
fix: correct skill match calculation in analyze route
docs: update API reference for /api/report
chore: update dependencies
```

## Pull Request Process

1. Fill out the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely
2. Keep pull requests focused on a single change or feature
3. Link any related issue (`Closes #123`)
4. Ensure the CI workflow passes
5. A maintainer will review and may request changes before merging

## Coding Guidelines

- Follow the existing code style used in the file you're editing
- Prefer clear, descriptive names over abbreviations
- Keep functions focused and reasonably small
- Add comments for non-obvious logic, not for restating what the code already says
- Never commit `.env` files, API keys, or any other credentials
- Do not commit files from `server/uploads/` (user-uploaded resumes)

## Reporting Bugs

Please use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Your environment (OS, browser, Node.js version)

## Suggesting Features

Please use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Check [Known Limitations](README.md#known-limitations) first to see if it's already tracked.

---

For questions, open a [Discussion](../../discussions) or an issue.
