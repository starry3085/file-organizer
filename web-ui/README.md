# 文件分类整理工具 - Web UI

本项目为文件分类整理工具的前端界面，基于 React + TypeScript 实现，支持在浏览器端本地递归读取文件夹并进行智能分类。

- 支持选择整个文件夹，递归分析和分类所有文件（不上传文件，隐私安全）
- 现代化UI，分类统计、进度条、图标展示
- 适合部署在 GitHub Pages 等静态站点，无需服务器

## 使用方法

1. 本地开发：
   ```bash
   npm install
   npm run dev
   ```
2. 构建并部署到 GitHub Pages：
   ```bash
   npm run build
   # 将 dist/ 目录内容推送到 gh-pages 分支或设置为 Pages 源
   ```

## 功能规划
- [x] 文件夹递归读取与展示
- [x] 分类规则本地推理
- [ ] 支持多文件批量分类
- [ ] 支持导出分类结果

## 安全说明
- 所有文件内容仅在浏览器本地处理，不会上传到服务器
- API Key仅在本地存储和调用
