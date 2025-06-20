export type LLMProvider = 'deepseek' | 'qwen';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
}

const VERCEL_PROXY_BASE = 'https://file-orer-proxy-muxypznubl.cn-shenzhen.fcapp.run';

async function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function callDeepSeekAPI(content: string, apiKey: string, model = 'deepseek-chat') {
  if (!apiKey) throw new Error('请填写DeepSeek API Key');
  const url = `${VERCEL_PROXY_BASE}/deepseek`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey,
      model,
      messages: [
        { role: 'system', content: '你是一个文件整理助手。请根据文件内容，分析并建议最合适的业务或生活场景分类标签（如：保险、行政、个人、个税、活动、图片、业务等），只返回标签，不要解释。' },
        { role: 'user', content: content.slice(0, 4000) },
      ],
      temperature: 0.2,
      max_tokens: 20,
    }),
  });
  if (!res.ok) throw new Error('DeepSeek API 调用失败，请检查API Key');
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '智能分类失败';
}

async function callQwenAPI(content: string, apiKey: string, model = 'qwen-turbo') {
  if (!apiKey) throw new Error('请填写通义千问API Key');
  const url = `${VERCEL_PROXY_BASE}/qwen`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey,
      model,
      input: { prompt: `你是一个文件整理助手。请根据文件内容，分析并建议最合适的业务或生活场景分类标签（如：保险、行政、个人、个税、活动、图片、业务等），只返回标签，不要解释。\n${content.slice(0, 4000)}` },
      parameters: { temperature: 0.2, max_tokens: 20 },
    }),
  });
  if (!res.ok) throw new Error('通义千问API调用失败，请检查API Key');
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
  const apiKey = config.apiKey || '';
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
    } catch (e: unknown) {
      category = (typeof e === 'object' && e && 'message' in e) ? (e as { message?: string }).message || '智能分类失败' : '智能分类失败';
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