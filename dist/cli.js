#!/usr/bin/env node
import { createRequire } from "node:module";
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// src/commands/init.ts
import { join as join2 } from "path";

// src/constants.ts
var RULE_PREFIXES = ["copilot", "cline", "cursor"];
var DEFAULT_AI_DOCS_DIR = "ai-docs";
var DEFAULT_RULES_DIR = "_rules";

// src/lib/file-utils.ts
import { existsSync, mkdirSync, copyFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
var ensureDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`\uD83D\uDCC1 Created directory: ${dir}`);
  }
};
var copyFileIfNotExists = (source, target) => {
  if (!existsSync(target)) {
    ensureDir(dirname(target));
    copyFileSync(source, target);
    console.log(`\uD83D\uDCC4 Copied file: ${target}`);
    return true;
  }
  console.log(`⚠️ File already exists (skipped): ${target}`);
  return false;
};
var copyDirRecursive = (source, target) => {
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
};
var createFileWithContent = (filePath, content) => {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
    console.log(`\uD83D\uDCC4 Created file: ${filePath}`);
  }
};
var checkLegacyFiles = (legacyFiles) => {
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
};
var getAiDocsDir = (currentDir) => {
  return join(currentDir, DEFAULT_AI_DOCS_DIR);
};
var getOutputPaths = (outputRootDir) => {
  return {
    copilot: join(outputRootDir, ".github", "copilot-instructions.md"),
    cline: join(outputRootDir, ".clinerules"),
    cursor: join(outputRootDir, ".cursor", "rules")
  };
};
var getIgnoreFilePath = (outputRootDir, prefix) => {
  switch (prefix) {
    case "cursor":
      return join(outputRootDir, ".cursor", "ignore");
    case "cline":
      return join(outputRootDir, ".clineignore");
    default:
      return join(outputRootDir, `.${prefix}ignore`);
  }
};

// src/commands/init.ts
var __dirname = "/Users/him0/src/ai-rule-forge/src/commands";
var initProject = () => {
  const currentDir = process.cwd();
  const aiDocsDir = join2(currentDir, DEFAULT_AI_DOCS_DIR);
  const rulesDir = join2(aiDocsDir, DEFAULT_RULES_DIR);
  ensureDir(aiDocsDir);
  ensureDir(rulesDir);
  const ignoreFilePath = join2(aiDocsDir, "ignore");
  createFileWithContent(ignoreFilePath, `# Ignore patterns for AI assistants
`);
  const templatesDir = join2(__dirname, "..", "templates");
  const templateRulesDir = join2(templatesDir, DEFAULT_RULES_DIR);
  if (__require("fs").existsSync(templateRulesDir)) {
    console.log("\uD83D\uDCC2 Copying rules templates...");
    copyDirRecursive(templateRulesDir, rulesDir);
  } else {
    console.warn("⚠️ Template rules directory not found:", templateRulesDir);
  }
  console.log(`✅ ${DEFAULT_AI_DOCS_DIR} project initialization complete!`);
  console.log("Next steps:");
  console.log(`1. Edit rules: modify files in the ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR}/ directory`);
  console.log(`2. Edit ignore patterns: modify the ${DEFAULT_AI_DOCS_DIR}/ignore file`);
  console.log("3. Compile: npx ai-docs compile");
  console.log("4. Preview: npx ai-docs preview");
};

// src/commands/compile.ts
import { existsSync as existsSync3, readFileSync as readFileSync2, writeFileSync as writeFileSync3, mkdirSync as mkdirSync3 } from "fs";
import { join as join4, dirname as dirname3 } from "path";

// src/lib/rule-generator.ts
import { existsSync as existsSync2, readFileSync, readdirSync as readdirSync2, writeFileSync as writeFileSync2, mkdirSync as mkdirSync2 } from "fs";
import { join as join3, dirname as dirname2 } from "path";
var filterContentByPrefix = (content, prefix) => {
  const lines = content.split(`
`);
  const result = [];
  let includeSection = true;
  let inSection = false;
  for (const line of lines) {
    if (line.startsWith("#")) {
      inSection = false;
      if (line.includes(`[${prefix}]`)) {
        includeSection = true;
        inSection = true;
        result.push(line.replace(`[${prefix}]`, "").trim());
      } else if (line.includes("[")) {
        includeSection = false;
      } else {
        includeSection = !inSection;
        result.push(line);
      }
    } else if (includeSection && line.trim() !== "") {
      result.push(line);
    }
  }
  return result.join(`
`);
};
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
var loadRuleFiles = (rulesDir) => {
  if (!existsSync2(rulesDir)) {
    console.error(`❌ Rules directory not found: ${rulesDir}`);
    process.exit(1);
  }
  const ruleFiles = readdirSync2(rulesDir).filter((file) => file.endsWith(".md")).sort();
  if (ruleFiles.length === 0) {
    console.warn(`⚠️ No rule files found in ${rulesDir}`);
  }
  return ruleFiles;
};
var previewRules = (rulesDir, ruleFiles) => {
  RULE_PREFIXES.forEach((prefix) => {
    console.log(`
=== ${prefix.toUpperCase()} PREVIEW ===
`);
    if (prefix === "cursor") {
      ruleFiles.forEach((file) => {
        const content = readFileSync(join3(rulesDir, file), "utf-8");
        const filteredContent = filterContentByPrefix(content, prefix);
        if (filteredContent.trim() !== "") {
          console.log(`--- ${file.replace(".md", ".mdc")} ---`);
          console.log(convertToMDC(filteredContent, file));
          console.log("");
        }
      });
    } else if (prefix === "cline") {
      ruleFiles.forEach((file) => {
        const content = readFileSync(join3(rulesDir, file), "utf-8");
        const filteredContent = filterContentByPrefix(content, prefix);
        if (filteredContent.trim() !== "") {
          console.log(`--- ${file} ---`);
          console.log(filteredContent);
          console.log("");
        }
      });
    } else {
      const filteredContent = ruleFiles.map((file) => {
        const content = readFileSync(join3(rulesDir, file), "utf-8");
        return filterContentByPrefix(content, prefix);
      }).filter((content) => content.trim() !== "").join(`

`);
      console.log(filteredContent);
    }
    console.log(`
=== END PREVIEW ===
`);
  });
};
var generateCursorFiles = (rulesDir, ruleFiles, outputPath) => {
  ruleFiles.forEach((file) => {
    const content = readFileSync(join3(rulesDir, file), "utf-8");
    const filteredContent = filterContentByPrefix(content, "cursor");
    if (filteredContent.trim() !== "") {
      const mdcFilename = file.replace(".md", ".mdc");
      const mdcPath = join3(outputPath, mdcFilename);
      const mdcContent = convertToMDC(filteredContent, file);
      writeFileSync2(mdcPath, mdcContent);
      console.log(`\uD83D\uDCC4 Generated: ${mdcPath}`);
    }
  });
};
var generateClineFiles = (rulesDir, ruleFiles, outputPath) => {
  ruleFiles.forEach((file) => {
    const content = readFileSync(join3(rulesDir, file), "utf-8");
    const filteredContent = filterContentByPrefix(content, "cline");
    if (filteredContent.trim() !== "") {
      const clineFilePath = join3(outputPath, file);
      writeFileSync2(clineFilePath, filteredContent + `
`);
      console.log(`\uD83D\uDCC4 Generated: ${clineFilePath}`);
    }
  });
};
var generateMergedFile = (rulesDir, ruleFiles, outputPath, prefix) => {
  const filteredContent = ruleFiles.map((file) => {
    const content = readFileSync(join3(rulesDir, file), "utf-8");
    return filterContentByPrefix(content, prefix);
  }).filter((content) => content.trim() !== "").join(`

`);
  writeFileSync2(outputPath, filteredContent + `
`);
  console.log(`\uD83D\uDCC4 Generated: ${outputPath}`);
};
var generateOutputFiles = (rulesDir, ruleFiles, outputPaths) => {
  mkdirSync2(dirname2(outputPaths.copilot), { recursive: true });
  mkdirSync2(outputPaths.cline, { recursive: true });
  mkdirSync2(outputPaths.cursor, { recursive: true });
  RULE_PREFIXES.forEach((prefix) => {
    switch (prefix) {
      case "cursor":
        generateCursorFiles(rulesDir, ruleFiles, outputPaths.cursor);
        break;
      case "cline":
        generateClineFiles(rulesDir, ruleFiles, outputPaths.cline);
        break;
      default:
        generateMergedFile(rulesDir, ruleFiles, outputPaths[prefix], prefix);
        break;
    }
  });
};
var generateRuleFiles = (inputRootDir, outputRootDir, preview = false) => {
  const rulesDir = join3(inputRootDir, DEFAULT_RULES_DIR);
  const outputPaths = getOutputPaths(outputRootDir);
  const ruleFiles = loadRuleFiles(rulesDir);
  if (preview) {
    previewRules(rulesDir, ruleFiles);
  } else {
    const legacyFiles = [
      { path: outputPaths.cline, name: ".clinerules" },
      { path: join3(outputRootDir, ".cursorrules"), name: ".cursorrules" },
      { path: join3(outputRootDir, ".cursorignore"), name: ".cursorignore" }
    ];
    checkLegacyFiles(legacyFiles);
    generateOutputFiles(rulesDir, ruleFiles, outputPaths);
    console.log("✨ Generated files successfully!");
  }
  if (outputRootDir !== ".") {
    console.log(`\uD83D\uDCC1 Using output directory: ${outputRootDir}`);
  }
  if (inputRootDir !== `./ai-docs`) {
    console.log(`\uD83D\uDCC1 Using input directory: ${inputRootDir}`);
  }
};

// src/commands/compile.ts
var compileRules = () => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);
  if (!existsSync3(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }
  console.log("\uD83D\uDD04 Compiling rules...");
  try {
    generateRuleFiles(aiDocsDir, currentDir);
    const ignoreFilePath = join4(aiDocsDir, "ignore");
    if (existsSync3(ignoreFilePath)) {
      const ignoreContent = readFileSync2(ignoreFilePath, "utf-8");
      RULE_PREFIXES.forEach((prefix) => {
        const outputPath = getIgnoreFilePath(currentDir, prefix);
        if (prefix === "cursor") {
          mkdirSync3(dirname3(outputPath), { recursive: true });
        }
        writeFileSync3(outputPath, ignoreContent);
        console.log(`\uD83D\uDCC4 Generated: ${outputPath}`);
      });
    }
    console.log("✅ Rules compiled successfully!");
  } catch (error) {
    console.error("❌ Error compiling rules:", error);
    process.exit(1);
  }
};

// src/commands/preview.ts
import { existsSync as existsSync4 } from "fs";
var previewRules2 = () => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);
  if (!existsSync4(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }
  console.log("\uD83D\uDD0D Previewing rules...");
  try {
    generateRuleFiles(aiDocsDir, currentDir, true);
    console.log("✅ Rules preview completed!");
  } catch (error) {
    console.error("❌ Error previewing rules:", error);
    process.exit(1);
  }
};

// src/commands/help.ts
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
    compileRules();
    break;
  case "preview":
    previewRules2();
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
