mkdir -p smake

for t in aarch64-smake-linux-gnu armv7-smake-linux-gnueabihf i686-smake-linux-gnu x86_64-smake-linux-gnu powerpc-smake-linux-gnu
do

cp -R $HOME/x-tools/$t/$t/sysroot smake/$t
chmod -R 755 smake/$t
cp -R $HOME/x-tools/$t/lib/gcc smake/$t/usr/lib/
cp -R $HOME/x-tools/$t/$t/include/c++ smake/$t/usr/include/

chmod -R 755 smake/$t

rm -rf smake/$t/etc
rm -rf smake/$t/sbin
rm -rf smake/$t/var


rm -rf smake/$t/usr/bin
rm -rf smake/$t/usr/libexec
rm -rf smake/$t/usr/sbin
rm -rf smake/$t/usr/share

clang++ -std=c++17 -target $t --sysroot=$PWD/smake/$t -fuse-ld=lld -static-libstdc++ -static-libgcc main.cc -o smake/main.$t

cd smake
tar cf $t.tar $t
cd ..

done