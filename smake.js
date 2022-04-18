const { LLVM } = require("smake");

const test = new LLVM('test', 'aarch64-unknown-linux-gnu');
test.files = ['main.cc'];

module.exports = [test];
