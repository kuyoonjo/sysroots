#!/usr/bin/env bash

_MSC_VER=1931
vc_ver=14.31.31103
win_kits_ver=10.0.22000.0
vc_dir="/c/Program Files/Microsoft Visual Studio/2022/Community/VC/Tools/MSVC/$vc_ver"

dist="z${_MSC_VER}_${vc_ver}_$win_kits_ver"

echo copy files ...

mkdir -p "$dist"
cp -R "/c/Program Files (x86)/Windows Kits/10/Include/$win_kits_ver" "$dist/include"
mkdir -p "$dist/lib"
cp -R "$vc_dir/include" "$dist/include/vc"
cp -R "$vc_dir/lib/arm" "$dist/lib/arm-pc-windows-msvc"
cp -R "$vc_dir/lib/arm64" "$dist/lib/aarch64-pc-windows-msvc"
cp -R "$vc_dir/lib/x86" "$dist/lib/i686-pc-windows-msvc"
cp -R "$vc_dir/lib/x64" "$dist/lib/x86_64-pc-windows-msvc"

cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/ucrt/arm"/* "$dist/lib/arm-pc-windows-msvc"
cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/ucrt/arm64"/* "$dist/lib/aarch64-pc-windows-msvc"
cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/ucrt/x86"/* "$dist/lib/i686-pc-windows-msvc"
cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/ucrt/x64"/* "$dist/lib/x86_64-pc-windows-msvc"

cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/um/arm"/* "$dist/lib/arm-pc-windows-msvc"
cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/um/arm64"/* "$dist/lib/aarch64-pc-windows-msvc"
cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/um/x86"/* "$dist/lib/i686-pc-windows-msvc"
cp -R "/c/Program Files (x86)/Windows Kits/10/Lib/$win_kits_ver/um/x64"/* "$dist/lib/x86_64-pc-windows-msvc"

echo compress $dist
tar cJf $dist.tar.xz $dist
