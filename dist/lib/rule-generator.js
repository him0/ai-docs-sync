"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRuleFiles = exports.convertToMDC = exports.filterContentByPrefix = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const constants_1 = require("../constants");
const file_utils_1 = require("./file-utils");
const filterContentByPrefix = (content, prefix) => {
    const lines = content.split('\n');
    const result = [];
    let includeSection = true;
    let inSection = false;
    for (const line of lines) {
        if (line.startsWith('#')) {
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
exports.filterContentByPrefix = filterContentByPrefix;
const convertToMDC = (content, filename) => {
    const baseName = filename.replace('.md', '');
    const frontMatter = `---
description: ${baseName}
globs:
alwaysApply: false
---

`;
    return frontMatter + content;
};
exports.convertToMDC = convertToMDC;
const loadRuleFiles = (rulesDir) => {
    if (!(0, fs_1.existsSync)(rulesDir)) {
        console.error(`❌ Rules directory not found: ${rulesDir}`);
        process.exit(1);
    }
    const ruleFiles = (0, fs_1.readdirSync)(rulesDir)
        .filter(file => file.endsWith('.md'))
        .sort();
    if (ruleFiles.length === 0) {
        console.warn(`⚠️ No rule files found in ${rulesDir}`);
    }
    return ruleFiles;
};
const previewRules = (rulesDir, ruleFiles) => {
    constants_1.RULE_PREFIXES.forEach(prefix => {
        console.log(`\n=== ${prefix.toUpperCase()} PREVIEW ===\n`);
        if (prefix === 'cursor') {
            ruleFiles.forEach(file => {
                const content = (0, fs_1.readFileSync)((0, path_1.join)(rulesDir, file), 'utf-8');
                const filteredContent = (0, exports.filterContentByPrefix)(content, prefix);
                if (filteredContent.trim() !== '') {
                    console.log(`--- ${file.replace('.md', '.mdc')} ---`);
                    console.log((0, exports.convertToMDC)(filteredContent, file));
                    console.log('');
                }
            });
        }
        else if (prefix === 'cline') {
            ruleFiles.forEach(file => {
                const content = (0, fs_1.readFileSync)((0, path_1.join)(rulesDir, file), 'utf-8');
                const filteredContent = (0, exports.filterContentByPrefix)(content, prefix);
                if (filteredContent.trim() !== '') {
                    console.log(`--- ${file} ---`);
                    console.log(filteredContent);
                    console.log('');
                }
            });
        }
        else {
            const filteredContent = ruleFiles
                .map(file => {
                const content = (0, fs_1.readFileSync)((0, path_1.join)(rulesDir, file), 'utf-8');
                return (0, exports.filterContentByPrefix)(content, prefix);
            })
                .filter(content => content.trim() !== '')
                .join('\n\n');
            console.log(filteredContent);
        }
        console.log('\n=== END PREVIEW ===\n');
    });
};
const generateCursorFiles = (rulesDir, ruleFiles, outputPath) => {
    ruleFiles.forEach(file => {
        const content = (0, fs_1.readFileSync)((0, path_1.join)(rulesDir, file), 'utf-8');
        const filteredContent = (0, exports.filterContentByPrefix)(content, 'cursor');
        if (filteredContent.trim() !== '') {
            const mdcFilename = file.replace('.md', '.mdc');
            const mdcPath = (0, path_1.join)(outputPath, mdcFilename);
            const mdcContent = (0, exports.convertToMDC)(filteredContent, file);
            (0, fs_1.writeFileSync)(mdcPath, mdcContent);
            console.log(`📄 Generated: ${mdcPath}`);
        }
    });
};
const generateClineFiles = (rulesDir, ruleFiles, outputPath) => {
    ruleFiles.forEach(file => {
        const content = (0, fs_1.readFileSync)((0, path_1.join)(rulesDir, file), 'utf-8');
        const filteredContent = (0, exports.filterContentByPrefix)(content, 'cline');
        if (filteredContent.trim() !== '') {
            const clineFilePath = (0, path_1.join)(outputPath, file);
            (0, fs_1.writeFileSync)(clineFilePath, filteredContent + '\n');
            console.log(`📄 Generated: ${clineFilePath}`);
        }
    });
};
const generateMergedFile = (rulesDir, ruleFiles, outputPath, prefix) => {
    const filteredContent = ruleFiles
        .map(file => {
        const content = (0, fs_1.readFileSync)((0, path_1.join)(rulesDir, file), 'utf-8');
        return (0, exports.filterContentByPrefix)(content, prefix);
    })
        .filter(content => content.trim() !== '')
        .join('\n\n');
    (0, fs_1.writeFileSync)(outputPath, filteredContent + '\n');
    console.log(`📄 Generated: ${outputPath}`);
};
const generateOutputFiles = (rulesDir, ruleFiles, outputPaths) => {
    (0, fs_1.mkdirSync)((0, path_1.dirname)(outputPaths.copilot), { recursive: true });
    (0, fs_1.mkdirSync)(outputPaths.cline, { recursive: true });
    (0, fs_1.mkdirSync)(outputPaths.cursor, { recursive: true });
    constants_1.RULE_PREFIXES.forEach(prefix => {
        switch (prefix) {
            case 'cursor':
                generateCursorFiles(rulesDir, ruleFiles, outputPaths.cursor);
                break;
            case 'cline':
                generateClineFiles(rulesDir, ruleFiles, outputPaths.cline);
                break;
            default:
                generateMergedFile(rulesDir, ruleFiles, outputPaths[prefix], prefix);
                break;
        }
    });
};
const generateRuleFiles = (inputRootDir, outputRootDir, preview = false) => {
    const rulesDir = (0, path_1.join)(inputRootDir, constants_1.DEFAULT_RULES_DIR);
    const outputPaths = (0, file_utils_1.getOutputPaths)(outputRootDir);
    const ruleFiles = loadRuleFiles(rulesDir);
    if (preview) {
        previewRules(rulesDir, ruleFiles);
    }
    else {
        const legacyFiles = [
            { path: outputPaths.cline, name: '.clinerules' },
            { path: (0, path_1.join)(outputRootDir, '.cursorrules'), name: '.cursorrules' },
            { path: (0, path_1.join)(outputRootDir, '.cursorignore'), name: '.cursorignore' }
        ];
        (0, file_utils_1.checkLegacyFiles)(legacyFiles);
        generateOutputFiles(rulesDir, ruleFiles, outputPaths);
        console.log('✨ Generated files successfully!');
    }
    if (outputRootDir !== '.') {
        console.log(`📁 Using output directory: ${outputRootDir}`);
    }
    if (inputRootDir !== `./ai-docs`) {
        console.log(`📁 Using input directory: ${inputRootDir}`);
    }
};
exports.generateRuleFiles = generateRuleFiles;
