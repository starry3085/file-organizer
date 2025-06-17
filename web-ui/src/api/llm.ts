export type LLMProvider = 'deepseek' | 'qwen';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
}

// 官方免费Key（仅示例，建议引导用户注册自己的免费Key）
const DEEPSEEK_FREE_KEY = '';
const QWEN_FREE_KEY = '';

async function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function callDeepSeekAPI(content: string, apiKey: string, model = 'deepseek-chat') {
  const url = 'https://api.deepseek.com/v1/chat/completions';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: '你是一个文件分类助手，请根据内容判断文件类型，返回最合适的分类标签（如：合同、发票、简历、论文、报告、图片、代码、表格、PPT、音频、视频、其他），只返回标签，不要解释。' },
        { role: 'user', content: content.slice(0, 4000) },
      ],
      temperature: 0.2,
      max_tokens: 20,
    }),
  });
  if (!res.ok) throw new Error('DeepSeek API 调用失败');
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '智能分类失败';
}

async function callQwenAPI(content: string, apiKey: string, model = 'qwen-turbo') {
  const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: { prompt: `请根据以下内容判断文件类型，返回最合适的分类标签（如：合同、发票、简历、论文、报告、图片、代码、表格、PPT、音频、视频、其他），只返回标签，不要解释。\n${content.slice(0, 4000)}` },
      parameters: { temperature: 0.2, max_tokens: 20 },
    }),
  });
  if (!res.ok) throw new Error('通义千问API调用失败');
  const data = await res.json();
  return data.output?.text?.trim() || '智能分类失败';
}

export async function classifyWithLLM(
  files: File[],
  config: LLMConfig,
  onQuota?: (remaining: number) => void
): Promise<{ name: string; type: string; category: string; path: string }[]> {
  const results: { name: string; type: string; category: string; path: string }[] = [];
  let quota = 100; // 假设免费额度100次，实际应通过API获取
  const apiKey = config.apiKey || (config.provider === 'deepseek' ? DEEPSEEK_FREE_KEY : QWEN_FREE_KEY);
  for (const f of files) {
    let category = '智能分类失败';
    try {
      const content = await readFileText(f);
      if (config.provider === 'deepseek') {
        category = await callDeepSeekAPI(content, apiKey, config.model);
      } else if (config.provider === 'qwen') {
        category = await callQwenAPI(content, apiKey, config.model);
      }
      quota--;
      if (onQuota && quota < 10) onQuota(quota);
    } catch (e) {
      category = '智能分类失败';
    }
    results.push({
      name: f.name,
      type: f.type,
      category,
      path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
    });
    if (quota <= 0) break;
  }
  return results;
} 