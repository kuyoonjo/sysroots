const { sync } = require('glob');
const { execSync } = require('child_process');

const dir = process.argv[2];
const files = sync('*.tar.xz', { cwd: dir });
for (const f of files) {
    execSync(`sha256sum ${f} > ${f}.sha256`, { stdio: 'inherit', cwd: dir });
}