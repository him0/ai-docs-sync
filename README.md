# AI Rule Forge

AI Document Management. Manage rules for GitHub Copilot, Cline, Cursor, and other AI tools.

## Overview

ai-rule-forge is a tool for managing rules for AI tools (GitHub Copilot, Cline, Cursor, etc.).
It allows you to generate configuration files for various AI tools from a single source.

## Usage

### Initialize a New Project

```bash
npx https://github.com/him0/ai-rule-forge init

This command will:
- Create the `ai-docs/` directory
- Create the `ai-docs/_rules/` directory
- Create basic rule files
- Create necessary configuration files
- Create the `ai-docs/ignore` file for defining ignore patterns
```

### Edit Rules

Edit Markdown files in the `ai-docs/_rules/` directory to define rules for AI tools.
You can use numeric prefixes (e.g., `01_security.md`) to control the order.

### Apply Rules

```bash
npx https://github.com/him0/ai-rule-forge compile
```

This command reads rule files from the `ai-docs/_rules/` directory and:

- Creates a symlink from `ai-docs/_rules` to `.clinerules` (for Cline)
- Generates `.github/copilot-instructions.md` (for GitHub Copilot)
- Generates `.cursorrules` (for Cursor)

It also reads the `ai-docs/ignore` file and generates:

- `.copilotignore` (for GitHub Copilot)
- `.clineignore` (for Cline)
- `.cursorignore` (for Cursor)

### Preview

```bash
npx https://github.com/him0/ai-rule-forge preview
```

This command previews the content of the rules that will be applied to each AI tool, without creating any symlinks or files.

## Writing Rules

Rules are written in standard Markdown, but you can specify rules that apply only to specific AI tools:

```markdown
# Security [copilot]

This section applies only to GitHub Copilot.

# Communication [cline]

This section applies only to Cline.

# Development [cursor]

This section applies only to Cursor.

# General Guidelines

This section applies to all AI tools.
```

## Ignore Patterns

Edit the `ai-docs/ignore` file to define patterns that should be ignored by AI tools:

```
# Ignore patterns for AI assistants
node_modules/
dist/
.env
*.log
```

When you run the `compile` command, these patterns will be copied to:

- `.copilotignore` (for GitHub Copilot)
- `.clineignore` (for Cline)
- `.cursorignore` (for Cursor)
