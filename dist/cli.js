#!/usr/bin/env node
import { createRequire } from "node:module";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// src/constants.ts
var RULE_PREFIXES, DEFAULT_AI_DOCS_DIR = "ai-docs", DEFAULT_RULES_DIR = "rules";
var init_constants = __esm(() => {
  RULE_PREFIXES = ["copilot", "cline", "cursor"];
});

// src/lib/file-utils.ts
var exports_file_utils = {};
__export(exports_file_utils, {
  getRulesDir: () => getRulesDir,
  getOutputPaths: () => getOutputPaths,
  getIgnoreFilePath: () => getIgnoreFilePath,
  getAiDocsDir: () => getAiDocsDir,
  ensureDir: () => ensureDir,
  createFileWithContent: () => createFileWithContent,
  copyFileIfNotExists: () => copyFileIfNotExists,
  copyDirRecursive: () => copyDirRecursive,
  checkLegacyFiles: () => checkLegacyFiles
});
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
var ensureDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`\uD83D\uDCC1 Created directory: ${dir}`);
  }
}, copyFileIfNotExists = (source, target) => {
  if (!existsSync(target)) {
    ensureDir(dirname(target));
    copyFileSync(source, target);
    console.log(`\uD83D\uDCC4 Copied file: ${target}`);
    return true;
  }
  console.log(`⚠️ File already exists (skipped): ${target}`);
  return false;
}, copyDirRecursive = (source, target) => {
  if (!existsSync(source)) {
    console.error(`❌ Source directory does not exist: ${source}`);
    return false;
  }
  ensureDir(target);
  const entries = readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(source, entry.name);
    const destPath = join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileIfNotExists(srcPath, destPath);
    }
  }
  return true;
}, createFileWithContent = (filePath, content) => {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
    console.log(`\uD83D\uDCC4 Created file: ${filePath}`);
  }
}, checkLegacyFiles = (legacyFiles) => {
  for (const { path, name } of legacyFiles) {
    if (existsSync(path)) {
      const stats = statSync(path);
      if (stats.isFile()) {
        console.error(`❌ Error: ${name} exists as a file but the new format uses directories.`);
        console.error(`   Please remove the existing ${name} file and try again.`);
        console.error(`   You can run: rm ${name}`);
        process.exit(1);
      }
    }
  }
}, getAiDocsDir = (currentDir) => {
  return join(currentDir, DEFAULT_AI_DOCS_DIR);
}, getRulesDir = (aiDocsDir) => {
  return join(aiDocsDir, DEFAULT_RULES_DIR);
}, getOutputPaths = (outputRootDir) => {
  return {
    copilot: join(outputRootDir, ".github", "copilot-instructions.md"),
    cline: join(outputRootDir, ".clinerules"),
    cursor: join(outputRootDir, ".cursor", "rules")
  };
}, getIgnoreFilePath = (outputRootDir, prefix) => {
  switch (prefix) {
    case "cursor":
      return join(outputRootDir, ".cursor", "ignore");
    case "cline":
      return join(outputRootDir, ".clineignore");
    default:
      return join(outputRootDir, `.${prefix}ignore`);
  }
};
var init_file_utils = __esm(() => {
  init_constants();
});

// src/commands/init.ts
init_constants();
init_file_utils();
import { join as join2 } from "path";
var __dirname = "/Users/him0/src/ai-rule-forge/src/commands";
var initProject = () => {
  const currentDir = process.cwd();
  const aiDocsDir = join2(currentDir, DEFAULT_AI_DOCS_DIR);
  const rulesDir = join2(aiDocsDir, DEFAULT_RULES_DIR);
  ensureDir(aiDocsDir);
  ensureDir(rulesDir);
  const templatesDir = join2(__dirname, "..", "templates");
  const templateRulesDir = join2(templatesDir, DEFAULT_RULES_DIR);
  const templateIgnoreFile = join2(templatesDir, "ignore");
  const targetIgnoreFile = join2(aiDocsDir, "ignore");
  if (__require("fs").existsSync(templateRulesDir)) {
    console.log("\uD83D\uDCC2 Copying rules templates...");
    copyDirRecursive(templateRulesDir, rulesDir);
  } else {
    console.warn("⚠️ Template rules directory not found:", templateRulesDir);
  }
  if (__require("fs").existsSync(templateIgnoreFile)) {
    copyFileIfNotExists(templateIgnoreFile, targetIgnoreFile);
  } else {
    console.warn("⚠️ Template ignore file not found, creating default");
    const { createFileWithContent: createFileWithContent2 } = (init_file_utils(), __toCommonJS(exports_file_utils));
    createFileWithContent2(targetIgnoreFile, `# Ignore patterns for AI assistants
`);
  }
  console.log(`✅ ${DEFAULT_AI_DOCS_DIR} project initialization complete!`);
  console.log("Next steps:");
  console.log(`1. Edit rules: modify files in the ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR}/ directory`);
  console.log(`2. Edit ignore patterns: modify the ${DEFAULT_AI_DOCS_DIR}/ignore file`);
  console.log("3. Compile: npx ai-docs-cli compile");
  console.log("4. Preview: npx ai-docs-cli preview");
};

// src/commands/compile.ts
init_constants();
init_file_utils();
import { existsSync as existsSync3 } from "fs";

// src/lib/compiler.ts
init_constants();
init_file_utils();
import { existsSync as existsSync2, readdirSync as readdirSync2, mkdirSync as mkdirSync2, readFileSync, writeFileSync as writeFileSync2 } from "fs";
import { join as join6, dirname as dirname2 } from "path";

// src/lib/generators/copilot-generator.ts
import { join as join3 } from "path";
var generate = (ruleFiles, outputRootDir) => {
  const outputPath = getOutputPath(outputRootDir);
  const mergedContent = ruleFiles.map((file) => file.content).filter((content) => content.trim() !== "").join(`

`);
  const finalContent = mergedContent + `
`;
  return [{
    path: outputPath,
    content: finalContent
  }];
};
var getOutputPath = (outputRootDir) => {
  return join3(outputRootDir, ".github", "copilot-instructions.md");
};
var getIgnorePath = (outputRootDir) => {
  return join3(outputRootDir, ".copilotignore");
};
var generateIgnore = (ignoreContent, outputRootDir) => {
  const ignorePath = getIgnorePath(outputRootDir);
  return {
    path: ignorePath,
    content: ignoreContent
  };
};
var getLegacyFiles = (outputRootDir) => {
  return [];
};
var copilotGenerator = {
  generate,
  generateIgnore,
  getOutputPath,
  getIgnorePath,
  getLegacyFiles
};

// src/lib/generators/cursor-generator.ts
import { join as join4 } from "path";
var convertToMDC = (content, filename) => {
  const baseName = filename.replace(".md", "");
  const frontMatter = `---
description: ${baseName}
globs:
alwaysApply: false
---

`;
  return frontMatter + content;
};
var generate2 = (ruleFiles, outputRootDir) => {
  const outputPath = getOutputPath2(outputRootDir);
  const generatedFiles = [];
  ruleFiles.forEach((ruleFile) => {
    if (ruleFile.content.trim() !== "") {
      const mdcFilename = ruleFile.filename.replace(".md", ".mdc");
      const mdcPath = join4(outputPath, mdcFilename);
      const mdcContent = convertToMDC(ruleFile.content, ruleFile.filename);
      generatedFiles.push({
        path: mdcPath,
        content: mdcContent
      });
    }
  });
  return generatedFiles;
};
var getOutputPath2 = (outputRootDir) => {
  return join4(outputRootDir, ".cursor", "rules");
};
var getIgnorePath2 = (outputRootDir) => {
  return join4(outputRootDir, ".cursor", "ignore");
};
var generateIgnore2 = (ignoreContent, outputRootDir) => {
  const ignorePath = getIgnorePath2(outputRootDir);
  return {
    path: ignorePath,
    content: ignoreContent
  };
};
var getLegacyFiles2 = (outputRootDir) => {
  return [
    { path: join4(outputRootDir, ".cursorrules"), name: ".cursorrules" },
    { path: join4(outputRootDir, ".cursorignore"), name: ".cursorignore" }
  ];
};
var cursorGenerator = {
  generate: generate2,
  generateIgnore: generateIgnore2,
  getOutputPath: getOutputPath2,
  getIgnorePath: getIgnorePath2,
  getLegacyFiles: getLegacyFiles2
};

// src/lib/generators/cline-generator.ts
import { join as join5 } from "path";
var generate3 = (ruleFiles, outputRootDir) => {
  const outputPath = getOutputPath3(outputRootDir);
  const generatedFiles = [];
  ruleFiles.forEach((ruleFile) => {
    if (ruleFile.content.trim() !== "") {
      const clineFilePath = join5(outputPath, ruleFile.filename);
      const finalContent = ruleFile.content + `
`;
      generatedFiles.push({
        path: clineFilePath,
        content: finalContent
      });
    }
  });
  return generatedFiles;
};
var getOutputPath3 = (outputRootDir) => {
  return join5(outputRootDir, ".clinerules");
};
var getIgnorePath3 = (outputRootDir) => {
  return join5(outputRootDir, ".clineignore");
};
var generateIgnore3 = (ignoreContent, outputRootDir) => {
  const ignorePath = getIgnorePath3(outputRootDir);
  return {
    path: ignorePath,
    content: ignoreContent
  };
};
var getLegacyFiles3 = (outputRootDir) => {
  const outputPath = getOutputPath3(outputRootDir);
  return [
    { path: outputPath, name: ".clinerules" }
  ];
};
var clineGenerator = {
  generate: generate3,
  generateIgnore: generateIgnore3,
  getOutputPath: getOutputPath3,
  getIgnorePath: getIgnorePath3,
  getLegacyFiles: getLegacyFiles3
};

// src/lib/generators/index.ts
var generators = {
  copilot: copilotGenerator,
  cursor: cursorGenerator,
  cline: clineGenerator
};
var getGenerator = (prefix) => {
  const generator = generators[prefix];
  if (!generator) {
    throw new Error(`No generator found for prefix: ${prefix}`);
  }
  return generator;
};

// src/lib/compiler.ts
var loadRuleFiles = (rulesDir) => {
  if (!existsSync2(rulesDir)) {
    console.error(`❌ Rules directory not found: ${rulesDir}`);
    process.exit(1);
  }
  const filenames = readdirSync2(rulesDir).filter((file) => file.endsWith(".md")).sort();
  if (filenames.length === 0) {
    console.warn(`⚠️ No rule files found in ${rulesDir}`);
  }
  return filenames.map((filename) => ({
    filename,
    content: readFileSync(join6(rulesDir, filename), "utf-8")
  }));
};
var generateOutputFiles = (ruleFiles, outputRootDir, dryRun = false) => {
  RULE_PREFIXES.forEach((prefix) => {
    const generator = getGenerator(prefix);
    const generatedFiles = generator.generate(ruleFiles, outputRootDir);
    if (dryRun) {
      console.log(`
=== ${prefix.toUpperCase()} PREVIEW ===`);
      generatedFiles.forEach((file) => {
        console.log(`
--- ${file.path} ---`);
        console.log(file.content);
      });
      console.log(`
=== END PREVIEW ===
`);
    } else {
      generatedFiles.forEach((file) => {
        mkdirSync2(dirname2(file.path), { recursive: true });
        writeFileSync2(file.path, file.content);
        console.log(`\uD83D\uDCC4 Generated: ${file.path}`);
      });
    }
  });
};
var generateIgnoreFiles = (inputRootDir, outputRootDir, dryRun = false) => {
  const ignoreFilePath = join6(inputRootDir, "ignore");
  if (existsSync2(ignoreFilePath)) {
    const ignoreContent = readFileSync(ignoreFilePath, "utf-8");
    RULE_PREFIXES.forEach((prefix) => {
      const generator = getGenerator(prefix);
      const generatedFile = generator.generateIgnore(ignoreContent, outputRootDir);
      if (generatedFile) {
        if (dryRun) {
          console.log(`
=== ${prefix.toUpperCase()} IGNORE PREVIEW ===`);
          console.log(`
--- ${generatedFile.path} ---`);
          console.log(generatedFile.content);
          console.log(`
=== END PREVIEW ===
`);
        } else {
          mkdirSync2(dirname2(generatedFile.path), { recursive: true });
          writeFileSync2(generatedFile.path, generatedFile.content);
          console.log(`\uD83D\uDCC4 Generated: ${generatedFile.path}`);
        }
      }
    });
  }
};
var compileRules = (inputRootDir, outputRootDir, dryRun = false) => {
  const rulesDir = join6(inputRootDir, DEFAULT_RULES_DIR);
  const ruleFiles = loadRuleFiles(rulesDir);
  if (!dryRun) {
    const allLegacyFiles = [];
    RULE_PREFIXES.forEach((prefix) => {
      const generator = getGenerator(prefix);
      allLegacyFiles.push(...generator.getLegacyFiles(outputRootDir));
    });
    checkLegacyFiles(allLegacyFiles);
  }
  generateOutputFiles(ruleFiles, outputRootDir, dryRun);
};
var compileIgnore = (inputRootDir, outputRootDir, dryRun = false) => {
  generateIgnoreFiles(inputRootDir, outputRootDir, dryRun);
};

// src/commands/compile.ts
var compile = () => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);
  if (!existsSync3(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }
  console.log("\uD83D\uDD04 Compiling rules...");
  try {
    compileRules(aiDocsDir, currentDir);
    compileIgnore(aiDocsDir, currentDir);
    console.log("✅ Rules compiled successfully!");
  } catch (error) {
    console.error("❌ Error compiling rules:", error);
    process.exit(1);
  }
};

// src/commands/preview.ts
init_constants();
init_file_utils();
import { existsSync as existsSync4 } from "fs";
var previewRules = () => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);
  if (!existsSync4(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }
  console.log("\uD83D\uDD0D Previewing rules...");
  try {
    compileRules(aiDocsDir, currentDir, true);
    compileIgnore(aiDocsDir, currentDir, true);
    console.log("✅ Rules preview completed!");
  } catch (error) {
    console.error("❌ Error previewing rules:", error);
    process.exit(1);
  }
};

// src/commands/help.ts
init_constants();
var showHelp = () => {
  console.log(`
ai-docs-cli

Usage:
  npx ai-docs <command>

Commands:
  init     - Initialize a new ${DEFAULT_AI_DOCS_DIR} project
  compile  - Compile rules from ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR} to output files and generate ignore files
  preview  - Preview rules without writing to output files
  help     - Show this help message
  `);
};

// src/cli.ts
var command = process.argv[2];
switch (command) {
  case "init":
    initProject();
    break;
  case "compile":
    compile();
    break;
  case "preview":
    previewRules();
    break;
  case "help":
  case "--help":
  case "-h":
    showHelp();
    break;
  default:
    console.log("❓ Unknown command: " + command);
    showHelp();
    process.exit(1);
}
