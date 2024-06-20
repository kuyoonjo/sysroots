const { sync } = require('glob');
const { execSync } = require('child_process');
const { symlinkSync, unlinkSync, mkdirSync, writeFileSync, rmSync } = require('fs');
const { join } = require('path');


const version = process.argv[2];
const vendor = 'ubuntu' + version;
const res = execSync(`docker buildx imagetools inspect ubuntu:${version} --raw`, { stdio: 'pipe' }).toString();
const info = JSON.parse(res);

console.log(info);


function triple(m) {
    let arch;
    let libc = 'gnu';
    switch (m.platform.architecture) {
        case 'amd64':
            arch = 'x86_64';
            break;
        case '386':
            arch = 'i386';
            break;
        case 'arm':
            arch = 'arm' + m.platform.variant;
            libc = 'gnueabihf'
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

const dockerFileTemplate = `FROM docker.io/library/ubuntu:{{version}}@{{sha256}}
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y gcc g++ libdbus-1-dev libtar-dev zlib1g-dev liblz4-dev liblzma-dev libssl-dev libcurl4-openssl-dev`;

for (const m of info.manifests) {
    const t = triple(m);
    if (t.startsWith('aarch64')) {
    console.log('Build ' + t);
    const dockerFile = dockerFileTemplate.replaceAll('{{version}}', version)
        .replaceAll('{{sha256}}', m.digest);
    const dockerFilePath = `${vendor}/${t}.Dockerfile`;
    writeFileSync(dockerFilePath, dockerFile);
    execSync(`docker build -t ${t} -f ${t}.Dockerfile .`, { stdio: 'inherit', cwd: vendor });
    mkdirSync(join(vendor, t), { recursive: true });
    execSync(`docker run --rm -it -v $PWD/${vendor}:/work ${t} bash -c "[ -d \"lib64\" ] && tar -cf work/${t}.tar lib lib64 usr/lib usr/include || tar -cf work/${t}.tar lib usr/lib usr/include"`, { stdio: 'inherit'});
    execSync(`tar -xf ${vendor}/${t}.tar -C ${vendor}/${t}`);
    for (const dir of 'ifupdown init lsb modprobe.d plymouth resolvconf systemd terminfo udev'.split(/\s+/)) {
        rmSync(`${vendor}/${t}/lib/${dir}`, { recursive: true, force: true });
    }
    for (const dir of 'apt eject gold-ld ldscripts mime python3 software-properties valgrind compat-ld girepository-1.0 initramfs-tools perl python3.4 ssl tmpfiles.d insserv perl5 sudo ubuntu-advantage dpkg gnupg klibc locale python2.7 sasl2 tar upstart'.split(/\s+/)) {
        rmSync(`${vendor}/${t}/usr/lib/${dir}`, { recursive: true, force: true });
    }
    const files = sync(`${vendor}/${t}/usr/lib/${t.replace(vendor + '-', '')}/*`);
    for (const f of files) {
        const res = execSync('ls -l ' + f, { stdio: 'pipe' }).toString();
        if (res.includes('->')) {
            let [_, dist] = res.split('->');
            dist = dist.trim();
            if (dist.startsWith('/')) {
                dist = '../../..' + dist;
                unlinkSync(f);
                symlinkSync(dist, f);
            }
        }
    }
    execSync(`rm -f ${t}.tar`, { cwd: vendor });
    execSync(`tar -cf ${t}.tar ${t}`, { cwd: vendor });
    rmSync(dockerFilePath);
    rmSync(`${vendor}/${t}`, { recursive: true, force: true });
}
}
