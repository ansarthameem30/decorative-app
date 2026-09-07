import { execSync } from 'child_process';

const git = '"C:\\Program Files\\Git\\cmd\\git.exe"';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const res = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    console.log(res.trim());
  } catch (err) {
    console.error('Error in command:', cmd);
    if (err.stdout) console.log('STDOUT:', err.stdout.toString());
    if (err.stderr) console.error('STDERR:', err.stderr.toString());
  }
}

run(`${git} init`);
run(`${git} status --short`);
run(`${git} add .gitignore AGENTS.md package.json package-lock.json tsconfig.json next.config.mjs tailwind.config.js postcss.config.js src scripts`);
run(`${git} config user.email "ansarthameem30@gmail.com"`);
run(`${git} config user.name "ansarthameem30"`);
run(`${git} commit -m "feat: complete Mikrokosmos BTS Borahae proposal app with Next.js 16, Supabase, and admin studio"`);
run(`${git} branch -M main`);
run(`${git} remote remove origin`);
run(`${git} remote add origin https://github.com/ansarthameem30/decorative-app.git`);
run(`${git} remote -v`);
run(`${git} log -1`);
