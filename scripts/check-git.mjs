import fs from 'fs';
import { spawn } from 'child_process';

console.log('Checking git paths...');

const paths = [
  'C:\\Program Files\\Git\\cmd\\git.exe',
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
  'C:\\Users\\ANSAR\\AppData\\Local\\Programs\\Git\\cmd\\git.exe',
  'C:\\Users\\ANSAR\\AppData\\Local\\Programs\\Git\\bin\\git.exe',
  'C:\\Users\\ANSAR\\AppData\\Local\\GitHubDesktop\\app-*\\resources\\app\\git\\cmd\\git.exe'
];

for (const p of paths) {
  if (fs.existsSync(p)) {
    console.log('FOUND:', p);
  }
}

console.log('Testing spawn git...');
const child = spawn('git', ['--version'], { shell: true });
child.stdout.on('data', (d) => console.log('git stdout:', d.toString()));
child.stderr.on('data', (d) => console.log('git stderr:', d.toString()));
child.on('error', (err) => console.log('git error:', err));
child.on('close', (code) => console.log('git exited with code:', code));

setTimeout(() => {
  console.log('Timed out waiting for git');
  process.exit(0);
}, 4000);
