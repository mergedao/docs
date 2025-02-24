const fs = require('fs');
const path = require('path');

// 递归遍历目录的函数
function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 递归遍历子目录
      traverseDirectory(fullPath);
    } else if (stat.isFile() && file.endsWith('.mdx') && !file.endsWith('-zh.mdx')) {
      // 检查是否为 .mdx 文件且不是中文版本
      const baseName = file.slice(0, -4); // 移除 .mdx 扩展名
      const zhFileName = `${baseName}-zh.mdx`;
      const zhFilePath = path.join(dir, zhFileName);

      // 检查中文版本是否已存在
      if (!fs.existsSync(zhFilePath)) {
        console.log(`Creating Chinese version for: ${file}`);
        // 复制原始文件内容到新的中文版本文件
        fs.copyFileSync(fullPath, zhFilePath);
      } else {
        console.log(`Chinese version already exists for: ${file}`);
      }
    }
  });
}

// 获取当前工作目录
const currentDir = process.cwd();
console.log(`Starting to process MDX files in: ${currentDir}`);

// 开始遍历
try {~
  traverseDirectory(currentDir);
  console.log('Processing completed successfully.');
} catch (error) {
  console.error('An error occurred:', error);
  process.exit(1);
}