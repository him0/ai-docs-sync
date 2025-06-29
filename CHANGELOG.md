# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.2] - 2025-06-29

### Fixed
- Updated all npx command references to use `@latest` version specifier for reliable package execution
- Fixed sync script in package.json to run without unnecessary 'sync' argument
- Added explicit shebang header to build process for proper npm execution

### Changed
- Updated README.md examples to use `npx @him0/ai-docs-sync@latest`
- Updated help command output to use `npx @him0/ai-docs-sync@latest`
- Updated CLAUDE.md with correct npx commands
