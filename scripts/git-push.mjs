import { execSync } from 'child_process';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const output = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error executing: ${cmd}`);
    if (error.stdout) console.log('stdout:', error.stdout.toString());
    if (error.stderr) console.error('stderr:', error.stderr.toString());
    return null;
  }
}

console.log('--- Step 1: Check Git version ---');
run('git --version');

console.log('--- Step 2: Git Init ---');
run('git init');

console.log('--- Step 3: Git Status ---');
run('git status --short');

console.log('--- Step 4: Git Add ---');
run('git add -A');

console.log('--- Step 5: Git Commit ---');
run('git commit -m "feat: complete Mikrokosmos BTS Borahae proposal app with Next.js 16, Supabase, and admin studio"');

console.log('--- Step 6: Git Remote ---');
run('git remote remove origin');
run('git remote add origin https://github.com/ansarthameem30/decorative-app.git');

console.log('--- Step 7: Git Branch -M main ---');
run('git branch -M main');

console.log('--- Step 8: Git Push ---');
run('git push -u origin main');
