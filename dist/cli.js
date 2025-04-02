#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
// Constants for rule compilation
const RULE_PREFIXES = ['copilot', 'cline', 'cursor'];
const DEFAULT_AI_DOCS_DIR = 'ai-docs';
const DEFAULT_RULES_DIR = '_rules';
// Parse command line arguments
const command = process.argv[2];
// Help message
const showHelp = () => {
    console.log(`
ai-rule-forge CLI

Usage:
  npx ai-rule-forge <command>

Commands:
  init     - Initialize a new ${DEFAULT_AI_DOCS_DIR} project
  compile  - Compile rules from ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR} to output files and generate ignore files
  preview  - Preview rules without writing to output files
  help     - Show this help message
  `);
};
// Create directory if it doesn't exist
const ensureDir = (dir) => {
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
};
// Copy file if target doesn't exist
const copyFileIfNotExists = (source, target) => {
    if (!(0, fs_1.existsSync)(target)) {
        ensureDir((0, path_1.dirname)(target));
        (0, fs_1.copyFileSync)(source, target);
        console.log(`📄 Copied file: ${target}`);
        return true;
    }
    console.log(`⚠️ File already exists (skipped): ${target}`);
    return false;
};
// Copy directory recursively
const copyDirRecursive = (source, target) => {
    if (!(0, fs_1.existsSync)(source)) {
        console.error(`❌ Source directory does not exist: ${source}`);
        return false;
    }
    ensureDir(target);
    const entries = (0, fs_1.readdirSync)(source, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = (0, path_1.join)(source, entry.name);
        const destPath = (0, path_1.join)(target, entry.name);
        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        }
        else {
            copyFileIfNotExists(srcPath, destPath);
        }
    }
    return true;
};
// Implementation of init command
const initProject = () => {
    const currentDir = process.cwd();
    // Create directory structure
    const aiDocsDir = (0, path_1.join)(currentDir, DEFAULT_AI_DOCS_DIR);
    const rulesDir = (0, path_1.join)(aiDocsDir, DEFAULT_RULES_DIR);
    ensureDir(aiDocsDir);
    ensureDir(rulesDir);
    // Create ignore file
    const ignoreFilePath = (0, path_1.join)(aiDocsDir, 'ignore');
    if (!(0, fs_1.existsSync)(ignoreFilePath)) {
        (0, fs_1.writeFileSync)(ignoreFilePath, '# Ignore patterns for AI assistants\n');
        console.log(`📄 Created file: ${ignoreFilePath}`);
    }
    // Copy template rules directory
    const templatesDir = (0, path_1.join)(__dirname, '..', 'src', 'templates');
    const templateRulesDir = (0, path_1.join)(templatesDir, DEFAULT_RULES_DIR);
    if ((0, fs_1.existsSync)(templateRulesDir)) {
        console.log('📂 Copying rules templates...');
        copyDirRecursive(templateRulesDir, rulesDir);
    }
    else {
        console.warn('⚠️ Template rules directory not found:', templateRulesDir);
    }
    console.log(`✅ ${DEFAULT_AI_DOCS_DIR} project initialization complete!`);
    console.log('Next steps:');
    console.log(`1. Edit rules: modify files in the ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR}/ directory`);
    console.log(`2. Edit ignore patterns: modify the ${DEFAULT_AI_DOCS_DIR}/ignore file`);
    console.log('3. Compile: npx ai-rule-forge compile');
    console.log('4. Preview: npx ai-rule-forge preview');
};
// Function to filter content based on prefix
const filterContentByPrefix = (content, prefix) => {
    const lines = content.split('\n');
    const result = [];
    let includeSection = true;
    let inSection = false;
    for (const line of lines) {
        if (line.startsWith('#')) {
            // Start of a new section
            inSection = false;
            if (line.includes(`[${prefix}]`)) {
                includeSection = true;
                inSection = true;
                result.push(line.replace(`[${prefix}]`, '').trim());
            }
            else if (line.includes('[')) {
                includeSection = false;
            }
            else {
                includeSection = !inSection;
                result.push(line);
            }
        }
        else if (includeSection && line.trim() !== '') {
            result.push(line);
        }
    }
    return result.join('\n');
};
// Generate rule files
const generateRuleFiles = (inputRootDir, outputRootDir, preview = false) => {
    // Define paths
    const RULES_DIR = (0, path_1.join)(inputRootDir, DEFAULT_RULES_DIR);
    const OUTPUT_PATHS = {
        copilot: (0, path_1.join)(outputRootDir, '.github', 'copilot-instructions.md'),
        cline: (0, path_1.join)(outputRootDir, '.clinerules'),
        cursor: (0, path_1.join)(outputRootDir, '.cursorrules')
    };
    // Check if rules directory exists
    if (!(0, fs_1.existsSync)(RULES_DIR)) {
        console.error(`❌ Rules directory not found: ${RULES_DIR}`);
        process.exit(1);
    }
    // Load and concatenate rule files
    const ruleFiles = (0, fs_1.readdirSync)(RULES_DIR)
        .filter(file => file.endsWith('.md'))
        .sort();
    if (ruleFiles.length === 0) {
        console.warn(`⚠️ No rule files found in ${RULES_DIR}`);
    }
    // Generate content for each prefix
    const contents = RULE_PREFIXES.map(prefix => {
        const filteredContent = ruleFiles
            .map(file => {
            const content = (0, fs_1.readFileSync)((0, path_1.join)(RULES_DIR, file), 'utf-8');
            return filterContentByPrefix(content, prefix);
        })
            .filter(content => content.trim() !== '')
            .join('\n\n');
        return { prefix, content: filteredContent };
    });
    if (preview) {
        // Preview mode: just display the content
        contents.forEach(({ prefix, content }) => {
            console.log(`\n=== ${prefix.toUpperCase()} PREVIEW ===\n`);
            console.log(content);
            console.log('\n=== END PREVIEW ===\n');
        });
    }
    else {
        // Actual file generation
        // Create output directories
        Object.values(OUTPUT_PATHS).forEach(path => {
            (0, fs_1.mkdirSync)((0, path_1.dirname)(path), { recursive: true });
        });
        // Write files
        contents.forEach(({ prefix, content }) => {
            (0, fs_1.writeFileSync)(OUTPUT_PATHS[prefix], content + '\n');
        });
        console.log('✨ Generated files successfully!');
    }
    // Log directories if specified
    if (outputRootDir !== '.') {
        console.log(`📁 Using output directory: ${outputRootDir}`);
    }
    if (inputRootDir !== `./${DEFAULT_AI_DOCS_DIR}`) {
        console.log(`📁 Using input directory: ${inputRootDir}`);
    }
};
// Implementation of compile command
const compileRules = () => {
    const currentDir = process.cwd();
    const aiDocsDir = (0, path_1.join)(currentDir, DEFAULT_AI_DOCS_DIR);
    if (!(0, fs_1.existsSync)(aiDocsDir)) {
        console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-rule-forge init first.`);
        process.exit(1);
    }
    console.log('🔄 Compiling rules...');
    try {
        // Use internal function instead of executing compile.js
        generateRuleFiles((0, path_1.join)(currentDir, DEFAULT_AI_DOCS_DIR), currentDir);
        // Generate ignore files
        const ignoreFilePath = (0, path_1.join)(aiDocsDir, 'ignore');
        if ((0, fs_1.existsSync)(ignoreFilePath)) {
            const ignoreContent = (0, fs_1.readFileSync)(ignoreFilePath, 'utf-8');
            // Create ignore files for each prefix
            RULE_PREFIXES.forEach(prefix => {
                const outputPath = (0, path_1.join)(currentDir, `.${prefix}ignore`);
                (0, fs_1.writeFileSync)(outputPath, ignoreContent);
                console.log(`📄 Generated: ${outputPath}`);
            });
        }
        console.log('✅ Rules compiled successfully!');
    }
    catch (error) {
        console.error('❌ Error compiling rules:', error);
        process.exit(1);
    }
};
// Implementation of preview command
const previewRules = () => {
    const currentDir = process.cwd();
    const aiDocsDir = (0, path_1.join)(currentDir, DEFAULT_AI_DOCS_DIR);
    if (!(0, fs_1.existsSync)(aiDocsDir)) {
        console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-rule-forge init first.`);
        process.exit(1);
    }
    console.log('🔍 Previewing rules...');
    try {
        // Use internal function instead of executing compile.js
        generateRuleFiles((0, path_1.join)(currentDir, DEFAULT_AI_DOCS_DIR), currentDir, true);
        console.log('✅ Rules preview completed!');
    }
    catch (error) {
        console.error('❌ Error previewing rules:', error);
        process.exit(1);
    }
};
// Main processing
switch (command) {
    case 'init':
        initProject();
        break;
    case 'compile':
        compileRules();
        break;
    case 'preview':
        previewRules();
        break;
    case 'help':
    case '--help':
    case '-h':
        showHelp();
        break;
    default:
        console.log('❓ Unknown command: ' + command);
        showHelp();
        process.exit(1);
}
