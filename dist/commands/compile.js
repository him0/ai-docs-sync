"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileRules = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const constants_1 = require("../constants");
const file_utils_1 = require("../lib/file-utils");
const rule_generator_1 = require("../lib/rule-generator");
const compileRules = () => {
    const currentDir = process.cwd();
    const aiDocsDir = (0, file_utils_1.getAiDocsDir)(currentDir);
    if (!(0, fs_1.existsSync)(aiDocsDir)) {
        console.error(`❌ ${constants_1.DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-rule-forge init first.`);
        process.exit(1);
    }
    console.log('🔄 Compiling rules...');
    try {
        (0, rule_generator_1.generateRuleFiles)(aiDocsDir, currentDir);
        const ignoreFilePath = (0, path_1.join)(aiDocsDir, 'ignore');
        if ((0, fs_1.existsSync)(ignoreFilePath)) {
            const ignoreContent = (0, fs_1.readFileSync)(ignoreFilePath, 'utf-8');
            constants_1.RULE_PREFIXES.forEach(prefix => {
                const outputPath = (0, file_utils_1.getIgnoreFilePath)(currentDir, prefix);
                if (prefix === 'cursor') {
                    (0, fs_1.mkdirSync)((0, path_1.dirname)(outputPath), { recursive: true });
                }
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
exports.compileRules = compileRules;
