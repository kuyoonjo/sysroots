const { sync } = require('glob');
const { execSync } = require('child_process');
const { symlinkSync, unlinkSync, mkdirSync, writeFileSync, rmSync } = require('fs');
const { join } = require('path');


const version = 'edge';
const vendor = 'alpine';
const res = execSync(`docker buildx imagetools inspect alpine:${version} --format "{{json .}}"`, { stdio: 'pipe' }).toString();
const info = JSON.parse(res);


function triple(m) {
    let arch;
    let libc = 'musl';
    switch (m.platform.architecture) {
        case 'amd64':
            arch = 'x86_64';
            break;
        case '386':
            arch = 'i386';
            break;
        case 'arm':
            arch = 'arm' + m.platform.variant;
            libc = 'musleabihf'
            break;
        case 'arm64':
            arch = 'aarch64';
            break;
        case 'ppc64le':
            arch = 'powerpc64le';
            break;
        case 'riscv64':
            arch = 'riscv64';
            break;
        case 's390x':
            arch = 's390x';
            break;
    }
    return [arch, vendor, 'linux', libc].join('-');
}

mkdirSync(vendor, { recursive: true });

const dockerFileTemplate = `FROM docker.io/library/alpine:{{version}}@{{sha256}}
RUN apk add g++`;

for (const m of info.manifest.manifests) {
    const t = triple(m);
    console.log('Build ' + t);
    const dockerFile = dockerFileTemplate.replaceAll('{{version}}', version)
        .replaceAll('{{sha256}}', m.digest)
    const dockerFilePath = `${vendor}/${t}.Dockerfile`;
    writeFileSync(dockerFilePath, dockerFile);
    execSync(`docker build -t ${t} -f ${t}.Dockerfile .`, { stdio: 'inherit', cwd: vendor });
    mkdirSync(join(vendor, t), { recursive: true });
    execSync(`docker run --rm -it -v $PWD/${vendor}:/work ${t} sh -c "[ -d \"lib64\" ] && tar -cf work/${t}.tar lib lib64 usr/lib usr/include || tar -cf work/${t}.tar lib usr/lib usr/include"`, { stdio: 'inherit'});
    execSync(`tar -xf ${vendor}/${t}.tar -C ${vendor}/${t}`);
    execSync(`rm -f ${t}.tar`, { cwd: vendor });
    execSync(`tar -cf ${t}.tar ${t}`, { cwd: vendor });
    rmSync(dockerFilePath);
    rmSync(`${vendor}/${t}`, { recursive: true, force: true });
}
