#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const scriptsDir = path.join(__dirname, 'scripts');
const packageJsonPath = path.join(scriptsDir, 'package.json');

console.log('🚀 CloudBase Examples 包构建工具\n');

// 检查 scripts 目录是否存在
if (!fs.existsSync(scriptsDir)) {
  console.error('❌ scripts 目录不存在，请先运行 npm run setup');
  process.exit(1);
}

// 检查依赖是否已安装
if (!fs.existsSync(path.join(scriptsDir, 'node_modules'))) {
  console.log('📦 检测到依赖未安装，正在安装...');
  
  const installProcess = spawn('npm', ['install'], {
    cwd: scriptsDir,
    stdio: 'inherit',
    shell: true
  });
  
  installProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ 依赖安装失败');
      process.exit(1);
    }
    
    console.log('✅ 依赖安装完成\n');
    runBuild();
  });
} else {
  runBuild();
}

function runBuild() {
  const buildProcess = spawn('npm', ['run', 'build'], {
    cwd: scriptsDir,
    stdio: 'inherit',
    shell: true
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 所有包构建完成！');
      console.log('📂 ZIP 文件已保存到 dist 目录');
    } else {
      console.error('❌ 构建过程中出现错误');
      process.exit(1);
    }
  });
} 