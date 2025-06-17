export type LLMProvider = 'deepseek' | 'qwen';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
}

export async function classifyWithLLM(
  files: File[],
  config: LLMConfig,
  onQuota?: (remaining: number) => void
): Promise<{ name: string; type: string; category: string; path: string }[]> {
  // 这里只做接口结构，具体API调用和免费额度检测后续补充
  // 示例：每个文件调用一次API，返回智能分类结果
  // 实际生产建议合并请求，节省额度
  const results: { name: string; type: string; category: string; path: string }[] = [];
  for (const f of files) {
    // TODO: 检查免费额度，onQuota(remaining)
    // TODO: 读取文件内容，调用大模型API
    // 这里只做mock，实际需实现API调用
    results.push({
      name: f.name,
      type: f.type,
      category: '智能分类（示例）',
      path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
    });
  }
  return results;
} 