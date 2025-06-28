# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Docs CLI is a CLI tool for managing rules and configuration files for various AI tools (GitHub Copilot, Cline, Cursor). It allows defining rules once in Markdown files and compiling them to different output formats.

## Common Commands

- `npm run build` - Compile TypeScript and make CLI executable
- `npm run init` - Run init command in development (via tsx)
- `npm run compile` - Run compile command in development
- `npm run preview` - Run preview command in development

## Architecture

### Core CLI System
- Main entry point: `src/cli.ts` - Single file containing all CLI logic
- Commands: `init`, `compile`, `preview`, `help`
- Template system: `src/templates/rules/` contains default rule templates

### Rule Compilation Process
1. Reads Markdown files from `ai-docs/rules/` directory (sorted alphabetically)
2. Loads all files into RuleFile objects (filename + content)
3. Passes all rule files to each generator
4. Each generator processes files according to its own logic:
   - **Copilot**: Merges all content into single file
   - **Cline**: Creates individual .md files 
   - **Cursor**: Converts to .mdc format with frontmatter

### Key Constants
- `RULE_PREFIXES`: `['copilot', 'cline', 'cursor']`
- `DEFAULT_AI_DOCS_DIR`: `'ai-docs'`
- `DEFAULT_RULES_DIR`: `'rules'`

### Generator Architecture
- Each AI tool has its own generator module implementing the `Generator` interface
- Generators are pure functions that return file paths and content
- No prefix-based filtering - each generator decides how to process rules
- Modular design allows easy addition of new AI tools

## Project Structure

- `src/cli.ts` - Main CLI entry point
- `src/commands/` - Individual command implementations (init, compile, preview, help)
- `src/lib/compiler.ts` - Core compilation orchestration
- `src/lib/generators/` - Modular generator system for each AI tool
- `src/templates/rules/` - Default rule templates for initialization
- `ai-docs/rules/` - User's rule files (created by init)
- `ai-docs/ignore` - Ignore patterns (copied to tool-specific ignore files)
- `dist/` - Compiled TypeScript output
- `package.json` - Defines CLI binary as `ai-docs`

## Legacy File Handling

The tool checks for and prevents conflicts with legacy file formats:
- `.clinerules` (file) vs `.clinerules/` (directory)
- `.cursorrules` (file) vs `.cursor/` (directory) 
- `.cursorignore` (file) vs `.cursor/ignore` (file)

Each generator defines its own legacy files via the `getLegacyFiles()` method, and the compiler checks for conflicts before generation.

## Security Requirements

- Never read or modify .env files, config/secrets, .pem files, or any files containing API keys/tokens
- Use environment variables for secrets
- Keep credentials out of logs and output
- Never commit sensitive files

## Communication

Developers are English speakers - use English for all interactions.