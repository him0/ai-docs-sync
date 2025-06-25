"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewRules = void 0;
const fs_1 = require("fs");
const constants_1 = require("../constants");
const file_utils_1 = require("../lib/file-utils");
const rule_generator_1 = require("../lib/rule-generator");
const previewRules = () => {
    const currentDir = process.cwd();
    const aiDocsDir = (0, file_utils_1.getAiDocsDir)(currentDir);
    if (!(0, fs_1.existsSync)(aiDocsDir)) {
        console.error(`❌ ${constants_1.DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-rule-forge init first.`);
        process.exit(1);
    }
    console.log('🔍 Previewing rules...');
    try {
        (0, rule_generator_1.generateRuleFiles)(aiDocsDir, currentDir, true);
        console.log('✅ Rules preview completed!');
    }
    catch (error) {
        console.error('❌ Error previewing rules:', error);
        process.exit(1);
    }
};
exports.previewRules = previewRules;
