# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking Changes
- **Project Rename**: Renamed from `ai-rule-forge` to `ai-docs-cli` to better reflect the tool's purpose
- **CLI Command**: Changed from `npx ai-rule-forge` to `npx ai-docs-cli` / `npx ai-docs`

### Changed
- **Migration to Bun**: Complete development environment migration to Bun for improved performance
- **Build System**: New Bun-based build system with Node.js compatibility
- **Development Workflow**: Simplified development workflow using Bun's native TypeScript support

### Added
- GitHub Actions CI/CD pipeline with Bun support
- Cross-runtime compatibility testing (Node.js 18, 20, 22)
- Automated npm publishing workflow
- TypeScript declaration files generation
- .npmignore file for clean package distribution

### Technical
- Removed tsx dependency in favor of Bun's native TypeScript execution
- Updated package.json scripts for Bun-first development
- Enhanced build configuration for npm distribution
- Added comprehensive CI testing matrix

## [0.2.0] - 2024-XX-XX

### Added
- Initial CLI implementation
- Support for GitHub Copilot, Cline, and Cursor
- Rule compilation from Markdown files
- Template system for initialization
- Ignore pattern management

### Features
- `init` command for project initialization
- `compile` command for rule compilation
- `preview` command for rule preview
- `help` command for usage information

## [0.1.0] - 2024-XX-XX

### Added
- Initial project setup
- Basic CLI structure
- Core functionality development