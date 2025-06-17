import React, { useState } from 'react';
import FilePicker from './components/FilePicker';
import CategoryTable from './components/CategoryTable';
import { useFileCategory } from './hooks/useFileCategory';
import type { LLMConfig, LLMProvider } from './api/llm';
import { classifyWithLLM } from './api/llm';
import { iconMap } from './utils/category';

const llmProviders: { value: LLMProvider; label: string }[] = [
  { value: 'deepseek', label: 'DeepSeek（免费）' },
  { value: 'qwen', label: '通义千问（免费）' },
];

const App: React.FC = () => {
  const { files, loading, progress, classifyFiles } = useFileCategory();
  const [llmFiles, setLlmFiles] = useState<typeof files>([]);
  const [useLLM, setUseLLM] = useState(false);
  const [llmProvider, setLlmProvider] = useState<LLMProvider>('deepseek');
  const [llmKey, setLlmKey] = useState('');
  const [llmLoading, setLlmLoading] = useState(false);
  const [quota, setQuota] = useState<number | null>(null);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

  const handleFilesChange = (fileList: File[]) => {
    setLlmFiles([]);
    setRawFiles(fileList);
    classifyFiles(fileList);
  };

  const handleLLMClassify = async () => {
    if (rawFiles.length === 0) return;
    setLlmLoading(true);
    const config: LLMConfig = { provider: llmProvider, apiKey: llmKey };
    const result = await classifyWithLLM(rawFiles, config, (remain) => setQuota(remain));
    setLlmFiles(result);
    setLlmLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', padding: 0 }}>
      <div style={{ maxWidth: 700, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #e5e7eb' }}>
        <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>📁 文件分类整理工具</h1>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <FilePicker onFilesChange={handleFilesChange} />
          <span style={{ color: '#888' }}>{files.length > 0 ? `已选 ${files.length} 个文件` : '未选择文件夹'}</span>
        </div>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontWeight: 500 }}>
            <input type="checkbox" checked={useLLM} onChange={e => setUseLLM(e.target.checked)} /> 使用大模型智能分类
          </label>
          {useLLM && (
            <>
              <select value={llmProvider} onChange={e => setLlmProvider(e.target.value as LLMProvider)}>
                {llmProviders.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <input
                type="text"
                placeholder="API Key（可选，留空用免费额度）"
                value={llmKey}
                onChange={e => setLlmKey(e.target.value)}
                style={{ width: 200 }}
              />
              <button onClick={handleLLMClassify} disabled={llmLoading || rawFiles.length === 0} style={{ marginLeft: 8 }}>
                {llmLoading ? '智能分类中...' : '智能分类'}
              </button>
              {quota !== null && quota < 5 && (
                <span style={{ color: 'red', marginLeft: 8 }}>免费额度即将用尽！</span>
              )}
            </>
          )}
        </div>
        {loading && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: 8, background: '#2563eb', transition: 'width 0.3s' }} />
            </div>
            <div style={{ color: '#2563eb', marginTop: 8 }}>正在分析文件... {progress}%</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          {[...new Set((useLLM && llmFiles.length > 0 ? llmFiles : files).map(f => f.category))].map(cat => (
            <div key={cat} style={{ background: '#f1f5f9', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 15 }}>
              {iconMap[cat] || iconMap['其他']} {cat}（{(useLLM && llmFiles.length > 0 ? llmFiles : files).filter(f => f.category === cat).length}）
            </div>
          ))}
        </div>
        <CategoryTable files={useLLM && llmFiles.length > 0 ? llmFiles : files} />
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
