#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  unlinkSync,
  lstatSync,
} from "fs";
import { join, dirname } from "path";

// Constants for rule compilation
const RULE_PREFIXES = ["copilot", "cline", "cursor"];
const DEFAULT_AI_DOCS_DIR = "ai-docs";
const DEFAULT_RULES_DIR = "_rules";

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
  compile  - Create symlink from ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR} to .clinerules and generate .cursorrules and .github/copilot-instructions.md files
  preview  - Preview rules without creating symlink or files
  help     - Show this help message
  `);
};

// Create directory if it doesn't exist
const ensureDir = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
};

// Copy file if target doesn't exist
const copyFileIfNotExists = (source: string, target: string) => {
  if (!existsSync(target)) {
    ensureDir(dirname(target));
    copyFileSync(source, target);
    console.log(`📄 Copied file: ${target}`);
    return true;
  }
  console.log(`⚠️ File already exists (skipped): ${target}`);
  return false;
};

// Copy directory recursively
const copyDirRecursive = (source: string, target: string) => {
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

// Implementation of init command
const initProject = () => {
  const currentDir = process.cwd();

  // Create directory structure
  const aiDocsDir = join(currentDir, DEFAULT_AI_DOCS_DIR);
  const rulesDir = join(aiDocsDir, DEFAULT_RULES_DIR);

  ensureDir(aiDocsDir);
  ensureDir(rulesDir);

  // Create ignore file
  const ignoreFilePath = join(aiDocsDir, "ignore");
  if (!existsSync(ignoreFilePath)) {
    writeFileSync(ignoreFilePath, "# Ignore patterns for AI assistants\n");
    console.log(`📄 Created file: ${ignoreFilePath}`);
  }

  // Copy template rules directory
  const templatesDir = join(__dirname, "..", "src", "templates");
  const templateRulesDir = join(templatesDir, DEFAULT_RULES_DIR);

  if (existsSync(templateRulesDir)) {
    console.log("📂 Copying rules templates...");
    copyDirRecursive(templateRulesDir, rulesDir);
  } else {
    console.warn("⚠️ Template rules directory not found:", templateRulesDir);
  }

  console.log(`✅ ${DEFAULT_AI_DOCS_DIR} project initialization complete!`);
  console.log("Next steps:");
  console.log(
    `1. Edit rules: modify files in the ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR}/ directory`
  );
  console.log(
    `2. Edit ignore patterns: modify the ${DEFAULT_AI_DOCS_DIR}/ignore file`
  );
  console.log("3. Create symlink and files: npx ai-rule-forge compile");
  console.log("4. Preview rules: npx ai-rule-forge preview");
};

// Function to filter content based on prefix
const filterContentByPrefix = (content: string, prefix: string): string => {
  const lines = content.split("\n");
  const result: string[] = [];
  let includeSection = true;
  let inSection = false;

  for (const line of lines) {
    if (line.startsWith("#")) {
      // Start of a new section
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

  return result.join("\n");
};

// Create symlink if it doesn't exist, or replace if it does
const createSymlink = (source: string, target: string) => {
  // Check if target already exists
  if (existsSync(target)) {
    // If it's a symlink, remove it
    if (lstatSync(target).isSymbolicLink()) {
      unlinkSync(target);
      console.log(`🔄 Removed existing symlink: ${target}`);
    } else {
      // If it's a file, error out
      console.error(
        `❌ Cannot create symlink: ${target} already exists as a file`
      );
      return false;
    }
  }

  // Ensure parent directory exists
  ensureDir(dirname(target));

  // Create symlink
  try {
    symlinkSync(source, target, "dir");
    console.log(`🔗 Created symlink: ${target} -> ${source}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create symlink: ${error}`);
    return false;
  }
};

// Check if .clinerules file exists
const checkClineruleFileExists = (outputRootDir: string) => {
  const path = join(outputRootDir, ".clinerules");

  if (existsSync(path) && !lstatSync(path).isSymbolicLink()) {
    console.error(`❌ File already exists: ${path}`);
    console.error(`   Please remove it before creating symlink.`);
    return true;
  }

  return false;
};

// Generate rule files
const generateRuleFiles = (
  inputRootDir: string,
  outputRootDir: string,
  preview: boolean = false
) => {
  // Define paths
  const RULES_DIR = join(inputRootDir, DEFAULT_RULES_DIR);
  const OUTPUT_PATHS = {
    copilot: join(outputRootDir, ".github", "copilot-instructions.md"),
    cline: join(outputRootDir, ".clinerules"),
    cursor: join(outputRootDir, ".cursorrules"),
  };

  // Check if rules directory exists
  if (!existsSync(RULES_DIR)) {
    console.error(`❌ Rules directory not found: ${RULES_DIR}`);
    process.exit(1);
  }

  // Load and concatenate rule files
  const ruleFiles = readdirSync(RULES_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();

  if (ruleFiles.length === 0) {
    console.warn(`⚠️ No rule files found in ${RULES_DIR}`);
  }

  // Generate content for each prefix
  const contents = RULE_PREFIXES.map((prefix) => {
    const filteredContent = ruleFiles
      .map((file) => {
        const content = readFileSync(join(RULES_DIR, file), "utf-8");
        return filterContentByPrefix(content, prefix);
      })
      .filter((content) => content.trim() !== "")
      .join("\n\n");
    return { prefix, content: filteredContent };
  });

  if (preview) {
    // Preview mode: just display the content
    contents.forEach(({ prefix, content }) => {
      console.log(`\n=== ${prefix.toUpperCase()} PREVIEW ===\n`);
      console.log(content);
      console.log("\n=== END PREVIEW ===\n");
    });
  } else {
    // Actual file generation
    // Create output directories
    Object.values(OUTPUT_PATHS).forEach((path) => {
      mkdirSync(dirname(path), { recursive: true });
    });

    // Write files
    contents.forEach(({ prefix, content }) => {
      writeFileSync(
        OUTPUT_PATHS[prefix as keyof typeof OUTPUT_PATHS],
        content + "\n"
      );
    });

    console.log("✨ Generated files successfully!");
  }

  // Log directories if specified
  if (outputRootDir !== ".") {
    console.log(`📁 Using output directory: ${outputRootDir}`);
  }
  if (inputRootDir !== `./${DEFAULT_AI_DOCS_DIR}`) {
    console.log(`📁 Using input directory: ${inputRootDir}`);
  }
};

// Implementation of compile command
const compileRules = () => {
  const currentDir = process.cwd();
  const aiDocsDir = join(currentDir, DEFAULT_AI_DOCS_DIR);
  const rulesDir = join(aiDocsDir, DEFAULT_RULES_DIR);

  if (!existsSync(aiDocsDir)) {
    console.error(
      `❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-rule-forge init first.`
    );
    process.exit(1);
  }

  if (!existsSync(rulesDir)) {
    console.error(`❌ Rules directory not found: ${rulesDir}`);
    process.exit(1);
  }

  console.log("🔄 Compiling rules...");
  try {
    // Check if .clinerules file already exists
    if (checkClineruleFileExists(currentDir)) {
      console.error("❌ Cannot create symlink due to existing file.");
      console.error("   Please remove the file listed above and try again.");
      process.exit(1);
    }

    // Create .clinerules symlink
    let success = createSymlink(rulesDir, join(currentDir, ".clinerules"));

    // Generate rule files for other prefixes
    const RULES_DIR = join(aiDocsDir, DEFAULT_RULES_DIR);

    // Load and concatenate rule files
    const ruleFiles = readdirSync(RULES_DIR)
      .filter((file) => file.endsWith(".md"))
      .sort();

    if (ruleFiles.length === 0) {
      console.warn(`⚠️ No rule files found in ${RULES_DIR}`);
    }

    // Generate content for cursor and copilot
    const contents = ["cursor", "copilot"].map((prefix) => {
      const filteredContent = ruleFiles
        .map((file) => {
          const content = readFileSync(join(RULES_DIR, file), "utf-8");
          return filterContentByPrefix(content, prefix);
        })
        .filter((content) => content.trim() !== "")
        .join("\n\n");
      return { prefix, content: filteredContent };
    });

    // Create output directories
    const OUTPUT_PATHS = {
      copilot: join(currentDir, ".github", "copilot-instructions.md"),
      cursor: join(currentDir, ".cursorrules"),
    };

    Object.values(OUTPUT_PATHS).forEach((path) => {
      mkdirSync(dirname(path), { recursive: true });
    });

    // Write files
    contents.forEach(({ prefix, content }) => {
      writeFileSync(
        OUTPUT_PATHS[prefix as "copilot" | "cursor"],
        content + "\n"
      );
      console.log(
        `📄 Generated: ${OUTPUT_PATHS[prefix as "copilot" | "cursor"]}`
      );
    });

    // Generate ignore files
    const ignoreFilePath = join(aiDocsDir, "ignore");
    if (existsSync(ignoreFilePath)) {
      const ignoreContent = readFileSync(ignoreFilePath, "utf-8");

      // Create ignore files for each prefix
      RULE_PREFIXES.forEach((prefix) => {
        const outputPath = join(currentDir, `.${prefix}ignore`);
        writeFileSync(outputPath, ignoreContent);
        console.log(`📄 Generated: ${outputPath}`);
      });
    }

    if (success) {
      console.log("✅ Rules compiled successfully!");
    } else {
      console.error("⚠️ Symlink could not be created.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error compiling rules:", error);
    process.exit(1);
  }
};

// Implementation of preview command
const previewRules = () => {
  const currentDir = process.cwd();
  const aiDocsDir = join(currentDir, DEFAULT_AI_DOCS_DIR);

  if (!existsSync(aiDocsDir)) {
    console.error(
      `❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-rule-forge init first.`
    );
    process.exit(1);
  }

  console.log("🔍 Previewing rules...");
  try {
    // Use internal function instead of executing compile.js
    generateRuleFiles(join(currentDir, DEFAULT_AI_DOCS_DIR), currentDir, true);
    console.log("✅ Rules preview completed!");
  } catch (error) {
    console.error("❌ Error previewing rules:", error);
    process.exit(1);
  }
};

// Main processing
switch (command) {
  case "init":
    initProject();
    break;
  case "compile":
    compileRules();
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
