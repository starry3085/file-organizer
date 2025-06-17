import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// DeepSeek API转发
app.post('/api/deepseek', async (req, res) => {
  const { apiKey, ...rest } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'Missing DeepSeek API Key' });
  try {
    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(rest),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy to DeepSeek failed' });
  }
});

// 通义千问API转发
app.post('/api/qwen', async (req, res) => {
  const { apiKey, ...rest } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'Missing Qwen API Key' });
  try {
    const resp = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(rest),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Proxy to Qwen failed' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app; 