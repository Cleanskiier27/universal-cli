const { spawnSync } = require('child_process');

function run(commandArgs) {
  console.log(`[GitHub Wrapper] Intercepted inner command. Proxying: gh ${commandArgs.join(' ')}`);
  
  // Real execution would map or rewrite args as needed
  const result = spawnSync('gh', commandArgs, { stdio: 'inherit', shell: true });
  
  if (result.error) {
    console.error(`[GitHub Wrapper Error] Could not launch GitHub CLI. Is 'gh' installed? Message: ${result.error.message}`);
  }
}

module.exports = { run };
