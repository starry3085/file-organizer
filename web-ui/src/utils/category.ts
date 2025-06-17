export const extensionMap: Record<string, string> = {
  'doc': 'Word文档', 'docx': 'Word文档',
  'xls': 'Excel表格', 'xlsx': 'Excel表格',
  'ppt': 'PPT演示', 'pptx': 'PPT演示',
  'pdf': 'PDF文档',
  'jpg': '图片', 'jpeg': '图片', 'png': '图片', 'gif': '图片', 'bmp': '图片', 'webp': '图片',
  'mp4': '视频', 'avi': '视频', 'mov': '视频', 'wmv': '视频',
  'mp3': '音频', 'wav': '音频',
  'zip': '压缩包', 'rar': '压缩包', '7z': '压缩包',
  'py': '代码', 'js': '代码', 'ts': '代码', 'java': '代码', 'cpp': '代码', 'c': '代码',
};

export function getFileCategory(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return extensionMap[ext] || '其他';
}

export const iconMap: Record<string, string> = {
  Word文档: '📄',
  Excel表格: '📊',
  PPT演示: '📈',
  PDF文档: '📕',
  图片: '🖼️',
  视频: '🎬',
  音频: '🎵',
  压缩包: '🗜️',
  代码: '��',
  其他: '📦',
}; 