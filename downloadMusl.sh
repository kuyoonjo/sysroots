mkdir -p musl
cd musl

for t in aarch64-linux-musl armv7l-linux-musleabihf i686-linux-musl x86_64-linux-musl powerpc64-linux-musl powerpc64le-linux-musl riscv32-linux-musl riscv64-linux-musl
do

# wget http://musl.cc/$t-cross.tgz
# tar -xzf $t-cross.tgz
clang++ -std=c++17 -target $t --sysroot=$PWD/$t -fuse-ld=lld -static ../main.cc -o main.$t

done
cd ..