import React, { useRef, useState } from 'react';

// 分类规则（可扩展）
const extensionMap: Record<string, string> = {
  'doc': 'Word文档', 'docx': 'Word文档',
  'xls': 'Excel表格', 'xlsx': 'Excel表格',
  'ppt': 'PPT演示', 'pptx': 'PPT演示',
  'pdf': 'PDF文档',
  'jpg': '图片', 'jpeg': '图片', 'png': '图片', 'gif': '图片', 'bmp': '图片', 'webp': '图片',
  'mp4': '视频', 'avi': '视频', 'mov': '视频', 'wmv': '视频',
  'mp3': '音频', 'wav': '音频',
  'zip': '压缩包', 'rar': '压缩包', '7z': '压缩包',
  'py': '代码', 'js': '代码', 'ts': '代码', 'java': '代码', 'cpp': '代码', 'c': '代码',
  // ...可继续扩展
};

const iconMap: Record<string, string> = {
  Word文档: '📄',
  Excel表格: '📊',
  PPT演示: '📈',
  PDF文档: '📕',
  图片: '🖼️',
  视频: '🎬',
  音频: '🎵',
  压缩包: '🗜️',
  代码: '💻',
  其他: '📦',
};

const App: React.FC = () => {
  const [files, setFiles] = useState<{ name: string; type: string; category: string; path: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 递归读取文件夹下所有文件
  const handleDirChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    setLoading(true);
    setProgress(0);
    // 递归处理所有文件
    const total = fileList.length;
    const result = fileList.map((f, idx) => {
      setProgress(Math.round(((idx + 1) / total) * 100));
      return {
        name: f.name,
        type: f.type,
        category: getFileCategory(f.name),
        path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
      };
    });
    setFiles(result);
    setLoading(false);
  };

  function getFileCategory(filename: string) {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return extensionMap[ext] || '其他';
  }

  // 兼容Safari/Chrome的文件夹选择
  const handlePickFolder = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: 0 }}>
      <div style={{ maxWidth: 700, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e5e7eb' }}>
        <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>📁 文件分类整理工具</h1>
        <div style={{ marginBottom: 24 }}>
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleDirChange}
            // @ts-ignore
            webkitdirectory="true"
            // @ts-ignore
            directory="true"
          />
          <button
            style={{
              padding: '10px 28px',
              fontSize: 16,
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 8px #e0e7ef',
            }}
            onClick={handlePickFolder}
          >
            选择文件夹
          </button>
          <span style={{ marginLeft: 16, color: '#888' }}>
            {files.length > 0 ? `已选 ${files.length} 个文件` : '未选择文件夹'}
          </span>
        </div>
        {loading && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: 8, background: '#2563eb', transition: 'width 0.3s' }} />
            </div>
            <div style={{ color: '#2563eb', marginTop: 8 }}>正在分析文件... {progress}%</div>
          </div>
        )}
        {files.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              {[...new Set(files.map(f => f.category))].map(cat => (
                <div key={cat} style={{ background: '#f1f5f9', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 15 }}>
                  {iconMap[cat] || iconMap['其他']} {cat}（{files.filter(f => f.category === cat).length}）
                </div>
              ))}
            </div>
            <div style={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>文件名</th>
                    <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>类型</th>
                    <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>分类</th>
                    <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>路径</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((f, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: 10 }}>{f.name}</td>
                      <td style={{ padding: 10 }}>{f.type || '-'}</td>
                      <td style={{ padding: 10 }}>{iconMap[f.category] || iconMap['其他']} {f.category}</td>
                      <td style={{ padding: 10, color: '#888' }}>{f.path}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div style={{ marginTop: 32, color: '#888', fontSize: 13, textAlign: 'center' }}>
          <div>所有文件仅在本地浏览器处理，绝不上传，API Key仅本地调用。</div>
          <div>开源地址：<a href="https://github.com/starry3085/file-organizer" target="_blank" rel="noopener noreferrer">starry3085/file-organizer</a></div>
        </div>
      </div>
    </div>
  );
};

export default App;

// test bugbot trigger
