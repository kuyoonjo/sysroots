for target in arm-ubuntu14.04-linux-gnueabihf aarch64-ubuntu14.04-linux-gnu i386-ubuntu14.04-linux-gnu x86_64-ubuntu14.04-linux-gnu
do
    docker build -t $target -f $target.Dockerfile .
    mkdir -p ubuntu/$target
    docker run --rm -it -v $PWD/ubuntu:/work $target [ -d "lib64" ] && tar -cf work/$target.tar lib lib64 usr/lib usr/include || tar -cf work/$target.tar lib usr/lib usr/include
    tar -xf ubuntu/$target.tar -C ubuntu/$target
    for dir in ifupdown init lsb modprobe.d plymouth resolvconf systemd terminfo udev
    do
        rm -rf ubuntu/$target/lib/$dir
    done
    for dir in apt eject gold-ld ldscripts mime python3 software-properties valgrind compat-ld girepository-1.0 initramfs-tools perl python3.4 ssl tmpfiles.d insserv perl5 sudo ubuntu-advantage dpkg gnupg klibc locale python2.7 sasl2 tar upstart
    do
        rm -rf ubuntu/$target/usr/lib/$dir
    done
    rm -f ubuntu/$target/lib/klibc*.so
    node buildUbuntu.js $target
    cd ubuntu
    tar -cJf $target.tar.xz $target
    rm -f $target.tar
    rm -rf $target
    sha256sum $target.tar.xz > $target.tar.xz.sha256
    cd ..
done
