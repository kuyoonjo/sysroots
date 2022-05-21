const { sync } = require('glob');
const { execSync } = require('child_process');

const dir = process.argv[2];
const files = sync('*.tar', { cwd: dir });
for (const f of files) {
    execSync(`xz -9vvf ${f}`, { stdio: 'inherit', cwd: dir });
}