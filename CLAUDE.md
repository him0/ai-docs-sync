# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Rule Forge is a CLI tool for managing rules and configuration files for various AI tools (GitHub Copilot, Cline, Cursor). It allows defining rules once in Markdown files and compiling them to different output formats.

## Common Commands

- `npm run build` - Compile TypeScript and make CLI executable
- `npm run init` - Run init command in development (via tsx)
- `npm run compile` - Run compile command in development
- `npm run preview` - Run preview command in development

## Architecture

### Core CLI System
- Main entry point: `src/cli.ts` - Single file containing all CLI logic
- Commands: `init`, `compile`, `preview`, `help`
- Template system: `src/templates/_rules/` contains default rule templates

### Rule Compilation Process
1. Reads Markdown files from `ai-docs/_rules/` directory
2. Filters content based on tool-specific prefixes: `[copilot]`, `[cline]`, `[cursor]`
3. Generates tool-specific output files:
   - `.github/copilot-instructions.md` (GitHub Copilot)
   - `.clinerules` (Cline)
   - `.cursorrules` (Cursor)

### Key Constants
- `RULE_PREFIXES`: `['copilot', 'cline', 'cursor']`
- `DEFAULT_AI_DOCS_DIR`: `'ai-docs'`
- `DEFAULT_RULES_DIR`: `'_rules'`

### Content Filtering Logic
The `filterContentByPrefix()` function processes Markdown content:
- Sections with `[toolname]` are included only for that tool
- Sections without brackets are included for all tools
- Maintains proper Markdown structure

## Project Structure

- `src/cli.ts` - Complete CLI implementation
- `src/templates/_rules/` - Default rule templates for initialization
- `ai-docs/_rules/` - User's rule files (created by init)
- `ai-docs/ignore` - Ignore patterns (copied to `.toolignore` files)

## Security Requirements

- Never read or modify .env files, config/secrets, .pem files, or any files containing API keys/tokens
- Use environment variables for secrets
- Keep credentials out of logs and output
- Never commit sensitive files

## Communication

Developers are English speakers - use English for all interactions.