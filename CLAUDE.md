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
1. Reads Markdown files from `ai-docs/_rules/` directory (sorted alphabetically)
2. Filters content based on tool-specific prefixes: `[copilot]`, `[cline]`, `[cursor]`
3. Generates tool-specific output files:
   - `.github/copilot-instructions.md` (GitHub Copilot - merged single file)
   - `.clinerules/` directory with individual .md files (Cline)
   - `.cursor/` directory with individual .mdc files with frontmatter (Cursor)

### Key Constants
- `RULE_PREFIXES`: `['copilot', 'cline', 'cursor']`
- `DEFAULT_AI_DOCS_DIR`: `'ai-docs'`
- `DEFAULT_RULES_DIR`: `'_rules'`

### Content Filtering Logic
The `filterContentByPrefix()` function in `src/cli.ts:112` processes Markdown content:
- Sections with `[toolname]` are included only for that tool
- Sections without brackets are included for all tools
- Maintains proper Markdown structure
- Cursor files get converted to MDC format with frontmatter via `convertToMDC()`

## Project Structure

- `src/cli.ts` - Complete CLI implementation (393 lines, all logic)
- `src/templates/_rules/` - Default rule templates for initialization
- `ai-docs/_rules/` - User's rule files (created by init)
- `ai-docs/ignore` - Ignore patterns (copied to `.toolignore` files)
- `dist/` - Compiled TypeScript output
- `package.json` - Defines CLI binary as `ai-rule-forge`

## Legacy File Handling

The tool checks for and prevents conflicts with legacy file formats:
- `.clinerules` (file) vs `.clinerules/` (directory)
- `.cursorrules` (file) vs `.cursor/` (directory) 
- `.cursorignore` (file) vs `.cursor/ignore` (file)

Error handling in `src/cli.ts:225` prevents overwriting if legacy files exist.

## Security Requirements

- Never read or modify .env files, config/secrets, .pem files, or any files containing API keys/tokens
- Use environment variables for secrets
- Keep credentials out of logs and output
- Never commit sensitive files

## Communication

Developers are English speakers - use English for all interactions.