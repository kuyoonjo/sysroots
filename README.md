这个项目制作了 LLVM/GCC 常用的 `sysroot`

## ubuntu

### ubuntu14.04 glibc 2.19 libstdc++ 6.0.28 gcc 9.4.0

- [x] aarch64-ubuntu14.04-linux-gnu
- [x] armv7-ubuntu14.04-linux-gnueabihf
- [x] i386-ubuntu14.04-linux-gnu
- [x] powerpc64le-ubuntu14.04-linux-gnu
- [x] x86_64-ubuntu14.04-linux-gnu

### ubuntu20.04 glibc 2.31 libstdc++ 6.0.29 gcc 11.1.0

- [x] aarch64-ubuntu20.04-linux-gnu
- [x] armv7-ubuntu20.04-linux-gnueabihf
- [x] powerpc64le-ubuntu20.04-linux-gnu
- [x] riscv64-ubuntu20.04-linux-gnu
- [x] s390x-ubuntu20.04-linux-gnu
- [x] x86_64-ubuntu20.04-linux-gnu

### smake(crosstools-ng) glibc 2.17 libstdc++ 6.0.30 gcc 12.0.1

- [x] aarch64-smake-linux-gnu
- [x] armv7-smake-linux-gnueabihf
- [x] i686-smake-linux-gnu
- [x] powerpc-smake-linux-gnu
- [x] x86_64-smake-linux-gnu

### alpine muslc 1.2.2 libstdc++ 6.0.29 gcc 11.2.1 

- [x] s390x-alpine-linux-musl
- [x] riscv64-alpine-linux-musl
- [x] powerpc64le-alpine-linux-musl
- [x] i386-alpine-linux-musl
- [x] aarch64-alpine-linux-musl
- [x] armv7-alpine-linux-musleabihf
- [x] armv6-alpine-linux-musleabihf
- [x] x86_64-alpine-linux-musl

### Cross-ng glibc 2.17 libstdc++ 6.0.29 gcc 11.1.0
- [x] aarch64-unknown-linux-gnu
- [x] aarch64-unknown-linux-musl
- [x] arm-unknown-linux-gnueabi
- [x] arm-unknown-linux-gnueabihf
- [x] armv7-unknown-linux-gnueabihf
- [x] armv7-unknown-linux-musleabihf
- [x] i686-unknown-linux-gnu
- [x] i686-unknown-linux-musl
- [x] x86_64-unknown-linux-gnu
- [x] x86_64-unknown-linux-mus

### Android
- [x] NDK

### Webassembly
- [x] WASI

## 制作方法

### Linux

#### ubuntu
使用 Docker 镜像制作。直接运行脚本。
```sh
# 14.04 为 ubuntu 版本。9 为 GCC 版本。会在 `'ubuntu' + 版本` 的目录下生成 TAR 包
node buildUbuntu.js 14.04 9

# 将指定目录下的 TAR 包压缩成 TAR.XZ 包。
node compressTars.js ubuntu14.04

# 为指定目录下的 TAR.XZ 包生成 sha256。
node makeSha256.js ubuntu14.04
```

#### alpine
使用 Docker 镜像制作。直接运行脚本。
```sh
node buildAlpine.js

# 将指定目录下的 TAR 包压缩成 TAR.XZ 包。
node compressTars.js alpine

# 为指定目录下的 TAR.XZ 包生成 sha256。
node makeSha256.js alpine
```


#### smake
使用最新版本 crosstool-ng 制作。

#### Crosstool-ng
[https://github.com/messense/homebrew-macos-cross-toolchains/releases](https://github.com/messense/homebrew-macos-cross-toolchains/releases)

下载其中一种版本（*-aarch64-darwin* 或 *-x86-64-darwin*）。这里只会用到 `sysroot` ，所以什么版本无所谓。解压后需要

1. 把 `include/c++` 移动至 `usr/include`
2. 把 `lib/gcc` 移动至 `usr/lib/gcc`

删除不需要的东西打包。

可使用脚本 `node buildLinux v11.2.0` 制作全部。`v11.2.0` 为版本号。

x86_64 和 i686 重新制作了。并更新 GCC 至 v11.3.0 。原因是默认不支持 Windows 下 Clang 使用。

### WASI
[https://github.com/WebAssembly/wasi-sdk/releases](https://github.com/WebAssembly/wasi-sdk/releases)

下载 `sysroot` 版本直接使用。

### NDK
[https://developer.android.com/ndk/downloads](https://developer.android.com/ndk/downloads)

下载 `Linux` 版本。这里只会用到 `sysroot` ，所以什么版本无所谓。

1. 只保留 `toolchains/llvm/prebuilt/linux-x86_64/sysroot`

