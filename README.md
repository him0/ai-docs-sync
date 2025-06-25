# AI Rule Forge

AI Document Management. Manage rules and knowledge for GitHub Copilot, Cline, Cursor, and other AI tools.

**Fast CLI built with Bun, compatible with Node.js and available via npx.**

## Overview

ai-rule-forge is a fast CLI tool built with Bun for managing rules and knowledge for AI tools (GitHub Copilot, Cline, Cursor, etc.).
It allows you to generate configuration files for various AI tools from a single source.

## Installation

### Quick Start (Recommended)

```bash
npx ai-rule-forge init
```

### Development with Bun

```bash
# Clone and install
bun install

# Development commands
bun run dev init          # Initialize project
bun run dev compile       # Compile rules
bun run dev preview       # Preview rules

# Build for distribution
bun run build
```

## Usage

### Initialize a New Project

```bash
npx ai-rule-forge init
```

This command will:
- Create the `ai-docs/` directory
- Create the `ai-docs/_rules/` directory
- Create basic rule files
- Create necessary configuration files
- Create the `ai-docs/ignore` file for defining ignore patterns


### Edit Rules

Edit Markdown files in the `ai-docs/_rules/` directory to define rules for AI tools.
You can use numeric prefixes (e.g., `01_security.md`) to control the order.

### Apply Rules

```bash
npx ai-rule-forge compile
```

This command reads rule files from the `ai-docs/_rules/` directory and generates:
- `.github/copilot-instructions.md` (for GitHub Copilot)
- `.clinerules/` directory with individual rule files (for Cline)
- `.cursor/rules/` directory with MDC format files (for Cursor)

It also reads the `ai-docs/ignore` file and generates:
- `.copilotignore` (for GitHub Copilot)
- `.clineignore` (for Cline)
- `.cursor/ignore` (for Cursor)

### Preview

```bash
npx ai-rule-forge preview
```

This command previews the content of the files that will be generated.

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
- `.cursor/ignore` (for Cursor)
