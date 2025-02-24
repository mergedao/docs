const fs = require('fs');
const path = require('path');

// 递归获取所有文件
function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// 主函数
function cleanDocs() {
  const rootDir = path.resolve(__dirname, '..');
  const files = getAllFiles(rootDir);
  
  // 收集所有需要处理的文件
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));
  const zhFiles = mdxFiles.filter(file => file.includes('-zh.mdx'));
  const nonZhFiles = mdxFiles.filter(file => !file.includes('-zh.mdx'));

  console.log(zhFiles);
  
  // 删除非中文版本的mdx文件
  for (const file of nonZhFiles) {
    try {
      fs.unlinkSync(file);
      console.log(`删除文件: ${file}`);
    } catch (err) {
      console.error(`删除文件失败 ${file}:`, err);
    }
  }
  
  // 重命名中文版本文件
  for (const file of zhFiles) {
    try {
      const newPath = file.replace('-zh.mdx', '.mdx');
      fs.renameSync(file, newPath);
      console.log(`重命名文件: ${file} -> ${newPath}`);
    } catch (err) {
      console.error(`重命名文件失败 ${file}:`, err);
    }
  }
  
  console.log('文档清理完成！');
}

// 执行清理操作
cleanDocs();