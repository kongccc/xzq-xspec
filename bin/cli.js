#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");

// 获取可用的模板列表
function getAvailableTemplates() {
  const templatesPath = path.join(__dirname, "..", "xspec");
  if (!fs.existsSync(templatesPath)) {
    return [];
  }

  try {
    const items = fs.readdirSync(templatesPath);
    return items.filter((item) => {
      const itemPath = path.join(templatesPath, item);
      return fs.statSync(itemPath).isDirectory();
    });
  } catch (error) {
    return [];
  }
}

// 复制模板文件
async function copyTemplate(templateName, projectName) {
  const templatePath = path.join(__dirname, "..", "xspec", templateName);
  const projectPath = path.join(process.cwd(), projectName);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`模板 "${templateName}" 不存在`);
  }

  if (fs.existsSync(projectPath)) {
    throw new Error(`项目目录 "${projectName}" 已存在`);
  }

  await fs.copy(templatePath, projectPath);
  return projectPath;
}

program
  .version("1.0.0")
  .command("init <project-name>")
  .description("从本地模板初始化新项目")
  .option("-t, --template <template>", "指定要使用的模板名称")
  .action(async (projectName, options) => {
    console.log(chalk.cyan("🚀 开始项目初始化..."));

    const availableTemplates = getAvailableTemplates();

    if (availableTemplates.length === 0) {
      console.log(
        chalk.yellow("⚠️  未找到任何模板。请确保temp文件夹中有模板文件。")
      );
      return;
    }

    let templateName = options.template;

    // 如果没有指定模板，让用户选择
    if (!templateName) {
      const answer = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "请选择模板:",
          choices: availableTemplates,
        },
      ]);
      templateName = answer.template;
    }

    if (!availableTemplates.includes(templateName)) {
      console.log(
        chalk.red(
          `❌ 模板 "${templateName}" 不存在。可用模板: ${availableTemplates.join(
            ", "
          )}`
        )
      );
      return;
    }

    const spinner = ora(`正在复制模板 "${templateName}"...`).start();

    try {
      const projectPath = await copyTemplate(templateName, projectName);
      spinner.succeed(chalk.green("模板复制成功!"));

      console.log(
        chalk.green(`
      ✅ 项目 "${projectName}" 已准备就绪。

      下一步操作:
      cd ${projectName}
      npm install
      npm run dev
      `)
      );
    } catch (error) {
      spinner.fail(chalk.red("复制失败"));
      console.error(chalk.red(error.message));
    }
  });

// 添加列出模板的命令
program
  .command("list")
  .description("列出所有可用的模板")
  .action(() => {
    const templates = getAvailableTemplates();

    if (templates.length === 0) {
      console.log(chalk.yellow("⚠️  未找到任何模板。"));
      return;
    }

    console.log(chalk.cyan("📁 可用模板:"));
    templates.forEach((template) => {
      console.log(chalk.green(`  • ${template}`));
    });
  });

program.parse(process.argv);
