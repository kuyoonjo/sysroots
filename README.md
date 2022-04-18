这个项目制作了 LLVM/GCC 常用的 `sysroot`

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
- [x] NDK
- [x] WASI

## 制作方法

### Linux

[https://github.com/messense/homebrew-macos-cross-toolchains/releases](https://github.com/messense/homebrew-macos-cross-toolchains/releases)

下载其中一种版本（*-aarch64-darwin* 或 *-x86-64-darwin*）。这里只会用到 `sysroot` ，所以什么版本无所谓。解压后需要

1. 把 `include/c++` 移动至 `usr/include`
2. 把 `lib/gcc` 移动至 `usr/lib/gcc`

删除不需要的东西打包。

可使用脚本 `node buildLinux v11.2.0` 制作全部。`v11.2.0` 为版本号。

### WASI
[https://github.com/WebAssembly/wasi-sdk/releases](https://github.com/WebAssembly/wasi-sdk/releases)

下载 `sysroot` 版本直接使用。

### NDK
[https://developer.android.com/ndk/downloads](https://developer.android.com/ndk/downloads)

下载 `Linux` 版本。这里只会用到 `sysroot` ，所以什么版本无所谓。

1. 只保留 `toolchains/llvm/prebuilt/linux-x86_64/sysroot`

