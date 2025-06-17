import React, { useState } from 'react';

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

const llmPlatforms = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'tongyi', label: '通义千问' },
];

function getFileCategory(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return extensionMap[ext] || '其他';
}

const App: React.FC = () => {
  // const [files, setFiles] = useState<File[]>([]);
  const [llmKey, setLlmKey] = useState('');
  const [llmPlatform, setLlmPlatform] = useState('openai');
  const [results, setResults] = useState<{ name: string; type: string; category: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    setResults(fileList.map(f => ({ name: f.name, type: f.type, category: getFileCategory(f.name) })));
  };

  // 预留：大模型API智能分类（后续实现）
  const handleLLMClassify = () => {
    alert('大模型API智能分类功能开发中...\n当前仅支持本地规则分类。');
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>文件自动分类工具</h2>
      <div style={{ marginBottom: 16 }}>
        <input type="file" multiple onChange={handleFileChange} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>大模型平台：</label>
        <select value={llmPlatform} onChange={e => setLlmPlatform(e.target.value)}>
          {llmPlatforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <input
          type="text"
          placeholder="输入API Key（可选）"
          value={llmKey}
          onChange={e => setLlmKey(e.target.value)}
          style={{ marginLeft: 8, width: 220 }}
        />
        <button style={{ marginLeft: 8 }} onClick={handleLLMClassify}>智能分类</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #eee' }}>文件名</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>类型</th>
            <th style={{ padding: 8, border: '1px solid #eee' }}>本地分类</th>
          </tr>
        </thead>
        <tbody>
          {results.map((f, i) => (
            <tr key={i}>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{f.name}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{f.type || '-'}</td>
              <td style={{ padding: 8, border: '1px solid #eee' }}>{f.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 24, color: '#888', fontSize: 13 }}>
        <div>所有文件仅在本地浏览器处理，绝不上传，API Key仅本地调用。</div>
        <div>开源地址：<a href="https://github.com/starry3085/file-organizer" target="_blank" rel="noopener noreferrer">starry3085/file-organizer</a></div>
      </div>
    </div>
  );
};

export default App;

// test bugbot trigger
