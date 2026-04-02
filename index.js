#!/usr/bin/env node

const { Command } = require('commander');
const { spawnSync } = require('child_process');
const path = require('path');
const githubWrapper = require('./wrappers/github');
const geminiWrapper = require('./wrappers/gemini');

const program = new Command();

program
  .name('ucli')
  .description('Universal wrapper CLI coordinating Node.js & Python configs')
  .version('1.0.0');

// Wrapper for GitHub CLI 
program
  .command('github <gh-command...>')
  .alias('gh')
  .description('Pass a command to the GitHub CLI via the wrapper')
  .action((ghCommandArgs) => {
    githubWrapper.run(ghCommandArgs);
  });

// Wrapper for Gemini CLI
program
  .command('gemini <gem-command...>')
  .alias('gem')
  .description('Pass a command to the Gemini CLI via the wrapper')
  .action((gemCommandArgs) => {
    geminiWrapper.run(gemCommandArgs);
  });

// Clustering / Configuration Engine (Python)
program
  .command('cluster')
  .description('Run universal clustering/configuration tasks via Python backend')
  .option('-t, --type <type>', 'Type of cluster (docker, database, cli-tasks)', 'docker')
  .option('-w, --workers <count>', 'Number of worker nodes', '3')
  .action((options) => {
    console.log(`[Node.js] Starting cluster engine type: ${options.type} with ${options.workers} workers...`);
    const pyScript = path.join(__dirname, 'configurator.py');
    const result = spawnSync('python', [pyScript, '--type', options.type, '--workers', options.workers], { stdio: 'inherit' });
    
    if (result.error) {
      console.error(`[Error] Failed to start Python configurator: ${result.error.message}`);
    }
  });

// Python Virtual Environment Creator
program
  .command('venv <env-name>')
  .description('Create a new Python virtual environment software space')
  .action((envName) => {
    console.log(`[Python VEnv] Creating virtual environment "${envName}"...`);
    const result = spawnSync('python', ['-m', 'venv', envName], { stdio: 'inherit' });
    if (result.error) {
      console.error(`[Error] Failed to create virtual environment: ${result.error.message}`);
    } else {
      console.log(`[Python VEnv] Successfully created environment "${envName}".`);
      console.log(`[Python VEnv] To activate: .\\${envName}\\Scripts\\activate (Windows) or source ${envName}/bin/activate (Unix)`);
    }
  });

program.parse(process.argv);
