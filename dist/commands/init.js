"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = void 0;
const path_1 = require("path");
const constants_1 = require("../constants");
const file_utils_1 = require("../lib/file-utils");
const initProject = () => {
    const currentDir = process.cwd();
    const aiDocsDir = (0, path_1.join)(currentDir, constants_1.DEFAULT_AI_DOCS_DIR);
    const rulesDir = (0, path_1.join)(aiDocsDir, constants_1.DEFAULT_RULES_DIR);
    (0, file_utils_1.ensureDir)(aiDocsDir);
    (0, file_utils_1.ensureDir)(rulesDir);
    const ignoreFilePath = (0, path_1.join)(aiDocsDir, 'ignore');
    (0, file_utils_1.createFileWithContent)(ignoreFilePath, '# Ignore patterns for AI assistants\n');
    const templatesDir = (0, path_1.join)(__dirname, '..', '..', 'src', 'templates');
    const templateRulesDir = (0, path_1.join)(templatesDir, constants_1.DEFAULT_RULES_DIR);
    if (require('fs').existsSync(templateRulesDir)) {
        console.log('📂 Copying rules templates...');
        (0, file_utils_1.copyDirRecursive)(templateRulesDir, rulesDir);
    }
    else {
        console.warn('⚠️ Template rules directory not found:', templateRulesDir);
    }
    console.log(`✅ ${constants_1.DEFAULT_AI_DOCS_DIR} project initialization complete!`);
    console.log('Next steps:');
    console.log(`1. Edit rules: modify files in the ${constants_1.DEFAULT_AI_DOCS_DIR}/${constants_1.DEFAULT_RULES_DIR}/ directory`);
    console.log(`2. Edit ignore patterns: modify the ${constants_1.DEFAULT_AI_DOCS_DIR}/ignore file`);
    console.log('3. Compile: npx ai-rule-forge compile');
    console.log('4. Preview: npx ai-rule-forge preview');
};
exports.initProject = initProject;
