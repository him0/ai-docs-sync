# AI Doc Sync

A fast CLI tool for synchronizing AI documentation rules across GitHub Copilot, Cline, Cursor, and other AI tools. Define rules once in Markdown files and sync them to different output formats.

**Fast CLI built with Bun, compatible with Node.js and available via npx.**

## Overview

AI Doc Sync is a fast CLI tool built with Bun for synchronizing rules and knowledge across AI tools (GitHub Copilot, Cline, Cursor, etc.).
It allows you to generate configuration files for various AI tools from a single source with a modular generator architecture.

## Installation

### Quick Start (Recommended)

```bash
npx ai-doc-sync init
```

### Development with Bun

```bash
# Clone and install
bun install

# Development commands
bun run init              # Initialize project
bun run sync              # Sync rules to output files

# Build for distribution
bun run build
```

## Usage

### Initialize a New Project

```bash
npx ai-doc-sync init
```

This command will:
- Create the `ai-docs/` directory
- Create the `ai-docs/rules/` directory with template files
- Create the `ai-docs/ignore` file for defining ignore patterns

### Edit Rules

Edit Markdown files in the `ai-docs/rules/` directory to define rules for AI tools.
You can use numeric prefixes (e.g., `01_security.md`) to control the order.

### Sync Rules

```bash
npx ai-doc-sync
```

This command reads rule files from the `ai-docs/rules/` directory and generates:
- `.github/copilot-instructions.md` (for GitHub Copilot - merged single file)
- `.clinerules/` directory with individual .md files (for Cline)
- `.cursor/rules/` directory with .mdc format files with frontmatter (for Cursor)

It also reads the `ai-docs/ignore` file and generates:
- `.copilotignore` (for GitHub Copilot)
- `.clineignore` (for Cline)
- `.cursor/ignore` (for Cursor)

### Preview Changes (Plan Mode)

```bash
npx ai-doc-sync plan
```

This command previews the content of the files that will be generated without writing them to disk.

## Writing Rules

Rules are written in standard Markdown format. Each AI tool generator processes the rule files according to its own requirements:

### File Structure

```
ai-docs/
├── rules/
│   ├── 00_ai-docs-base.md     # Base configuration
│   ├── 01_security.md         # Security guidelines
│   └── 02_communication.md    # Communication rules
└── ignore                     # Ignore patterns
```

### Rule Content

Each rule file contains standard Markdown content:

```markdown
# Security Guidelines

Always follow security best practices:

- Never expose API keys or secrets
- Validate all user inputs
- Use secure coding practices

## Code Review

- Review all code changes
- Test security implications
- Document security decisions
```

### Generator Behavior

- **GitHub Copilot**: Merges all rule files into a single `.github/copilot-instructions.md`
- **Cline**: Creates individual `.md` files in `.clinerules/` directory
- **Cursor**: Converts each file to `.mdc` format with frontmatter in `.cursor/rules/`

## Ignore Patterns

Edit the `ai-docs/ignore` file to define patterns that should be ignored by AI tools:

```
# Ignore patterns for AI assistants
node_modules/
dist/
.env
*.log
```

When you run `ai-doc-sync`, these patterns will be copied to:
- `.copilotignore` (for GitHub Copilot)
- `.clineignore` (for Cline)
- `.cursor/ignore` (for Cursor)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
