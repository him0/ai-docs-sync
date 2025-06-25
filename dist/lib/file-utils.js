"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIgnoreFilePath = exports.getOutputPaths = exports.getRulesDir = exports.getAiDocsDir = exports.checkLegacyFiles = exports.createFileWithContent = exports.copyDirRecursive = exports.copyFileIfNotExists = exports.ensureDir = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const constants_1 = require("../constants");
// File operation utilities
const ensureDir = (dir) => {
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
};
exports.ensureDir = ensureDir;
const copyFileIfNotExists = (source, target) => {
    if (!(0, fs_1.existsSync)(target)) {
        (0, exports.ensureDir)((0, path_1.dirname)(target));
        (0, fs_1.copyFileSync)(source, target);
        console.log(`📄 Copied file: ${target}`);
        return true;
    }
    console.log(`⚠️ File already exists (skipped): ${target}`);
    return false;
};
exports.copyFileIfNotExists = copyFileIfNotExists;
const copyDirRecursive = (source, target) => {
    if (!(0, fs_1.existsSync)(source)) {
        console.error(`❌ Source directory does not exist: ${source}`);
        return false;
    }
    (0, exports.ensureDir)(target);
    const entries = (0, fs_1.readdirSync)(source, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = (0, path_1.join)(source, entry.name);
        const destPath = (0, path_1.join)(target, entry.name);
        if (entry.isDirectory()) {
            (0, exports.copyDirRecursive)(srcPath, destPath);
        }
        else {
            (0, exports.copyFileIfNotExists)(srcPath, destPath);
        }
    }
    return true;
};
exports.copyDirRecursive = copyDirRecursive;
const createFileWithContent = (filePath, content) => {
    if (!(0, fs_1.existsSync)(filePath)) {
        (0, fs_1.writeFileSync)(filePath, content);
        console.log(`📄 Created file: ${filePath}`);
    }
};
exports.createFileWithContent = createFileWithContent;
const checkLegacyFiles = (legacyFiles) => {
    for (const { path, name } of legacyFiles) {
        if ((0, fs_1.existsSync)(path)) {
            const stats = (0, fs_1.statSync)(path);
            if (stats.isFile()) {
                console.error(`❌ Error: ${name} exists as a file but the new format uses directories.`);
                console.error(`   Please remove the existing ${name} file and try again.`);
                console.error(`   You can run: rm ${name}`);
                process.exit(1);
            }
        }
    }
};
exports.checkLegacyFiles = checkLegacyFiles;
// Path utilities
const getAiDocsDir = (currentDir) => {
    return (0, path_1.join)(currentDir, constants_1.DEFAULT_AI_DOCS_DIR);
};
exports.getAiDocsDir = getAiDocsDir;
const getRulesDir = (aiDocsDir) => {
    return (0, path_1.join)(aiDocsDir, constants_1.DEFAULT_RULES_DIR);
};
exports.getRulesDir = getRulesDir;
const getOutputPaths = (outputRootDir) => {
    return {
        copilot: (0, path_1.join)(outputRootDir, '.github', 'copilot-instructions.md'),
        cline: (0, path_1.join)(outputRootDir, '.clinerules'),
        cursor: (0, path_1.join)(outputRootDir, '.cursor', 'rules')
    };
};
exports.getOutputPaths = getOutputPaths;
const getIgnoreFilePath = (outputRootDir, prefix) => {
    switch (prefix) {
        case 'cursor':
            return (0, path_1.join)(outputRootDir, '.cursor', 'ignore');
        case 'cline':
            return (0, path_1.join)(outputRootDir, '.clineignore');
        default:
            return (0, path_1.join)(outputRootDir, `.${prefix}ignore`);
    }
};
exports.getIgnoreFilePath = getIgnoreFilePath;
