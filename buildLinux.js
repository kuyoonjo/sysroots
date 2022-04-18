const cliProgress = require('cli-progress');
const request = require('request');
const fs = require('fs');
const child_process = require('child_process');
const { join } = require('path');
const util = require('util');

const version = process.argv[2];
const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: '{bar} {percentage}% | {filename}',

}, cliProgress.Presets.shades_grey);

const baseUrl = `https://github.com/messense/homebrew-macos-cross-toolchains/releases/download/${version}/`;
const files = [
    'aarch64-unknown-linux-gnu-aarch64-darwin.tar.gz',
    'aarch64-unknown-linux-musl-aarch64-darwin.tar.gz',
    'arm-unknown-linux-gnueabi-aarch64-darwin.tar.gz',
    'arm-unknown-linux-gnueabihf-aarch64-darwin.tar.gz',
    'armv7-unknown-linux-gnueabihf-aarch64-darwin.tar.gz',
    'armv7-unknown-linux-musleabihf-aarch64-darwin.tar.gz',
    'i686-unknown-linux-gnu-aarch64-darwin.tar.gz',
    'i686-unknown-linux-musl-aarch64-darwin.tar.gz',
    'x86_64-unknown-linux-gnu-aarch64-darwin.tar.gz',
    'x86_64-unknown-linux-musl-aarch64-darwin.tar.gz',
];

(async () => {
    try {
        await Promise.all(files.map(async f => new Promise((r, rr) => {
            let progressBar;

            const savedFilename = f.replace('-aarch64-darwin', '');
            const file = fs.createWriteStream(savedFilename);
            let receivedBytes = 0


            request.get(baseUrl + f)
                .on('response', (response) => {
                    if (response.statusCode !== 200) {
                        return callback('Response status was ' + response.statusCode);
                    }

                    const totalBytes = response.headers['content-length'];
                    progressBar = multibar.create(totalBytes, 0, { filename: `download ${savedFilename}` });
                })
                .on('data', (chunk) => {
                    receivedBytes += chunk.length;
                    progressBar.update(receivedBytes);
                })
                .pipe(file)
                .on('error', (err) => {
                    fs.unlink(filename);
                    progressBar.stop();
                    return rr(err.message);
                });

            file.on('finish', async () => {
                file.close();
                const exec = util.promisify(child_process.exec);
                const rename = util.promisify(fs.rename);
                const rm = util.promisify(fs.rm);
                try {
                    progressBar.update(receivedBytes, { filename: `extract ${savedFilename}` });
                    await exec(`tar -xf ${savedFilename}`);
                    await rm(savedFilename);
                    const dirname = savedFilename.replace('.tar.gz', '');
                    await rename(join(dirname, 'lib', 'gcc'), join(dirname, dirname, 'sysroot', 'usr', 'lib', 'gcc'));
                    await rename(join(dirname, dirname, 'include', 'c++'), join(dirname, dirname, 'sysroot', 'usr', 'include', 'c++'));
                    const tmp = '.' + dirname
                    await rename(dirname, tmp);
                    await rename(join(tmp, dirname, 'sysroot'), dirname);
                    await rm(join(dirname, 'etc'), {force: true, recursive: true});
                    await rm(join(dirname, 'sbin'), {force: true, recursive: true});
                    await rm(join(dirname, 'var'), {force: true, recursive: true});
                    await rm(join(dirname, 'usr', 'bin'), {force: true, recursive: true});
                    await rm(join(dirname, 'usr', 'libexec'), {force: true, recursive: true});
                    await rm(join(dirname, 'usr', 'sbin'), {force: true, recursive: true});
                    await rm(join(dirname, 'usr', 'share'), {force: true, recursive: true});
                    progressBar.update(receivedBytes, { filename: `compress ${dirname}.tar.xz` });
                    await exec(`tar cJf ${dirname}.tar.xz ${dirname}`);
                    await rm(dirname, {force: true, recursive: true});
                    await rm(tmp, {force: true, recursive: true});
                    r();
                } catch (e) {
                    rr(e);
                }
                progressBar.stop();
            });

            file.on('error', (err) => {
                fs.unlink(filename);
                progressBar.stop();
                return rr(err.message);
            });
        })));
        multibar.stop();
    } catch (e) {
        multibar.stop();
        console.error(e);
    }
})();
