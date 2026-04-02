const { spawnSync } = require('child_process');

function run(commandArgs) {
  console.log(`[Gemini Wrapper] Intercepted inner command. Proxying: gemini ${commandArgs.join(' ')}`);
  
  // Real execution would map or secure args as needed
  const result = spawnSync('gemini', commandArgs, { stdio: 'inherit', shell: true });
  
  if (result.error) {
    console.error(`[Gemini Wrapper Error] Could not launch Gemini CLI. Is 'gemini' installed? Message: ${result.error.message}`);
  }
}

module.exports = { run };
