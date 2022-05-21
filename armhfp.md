virt-install \
 --name centos7_armhfp \
 --memory 4096 \
 --boot kernel=/var/lib/libvirt/armhfp-boot/boot/vmlinuz-5.4.72-200.el7.armv7hl,initrd=/var/lib/libvirt/armhfp-boot/boot/initramfs-5.4.72-200.el7.armv7hl.img,kernel_args="console=ttyAMA0 rw root=/dev/sda3" \
 --disk /var/lib/libvirt/images/centos.qcow2 \
 --import \
 --arch armv7l \
 --machine virt \