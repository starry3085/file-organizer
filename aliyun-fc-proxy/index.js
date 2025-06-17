const fetch = require('node-fetch');

module.exports.handler = async (event, context, callback) => {
  try {
    const { path, httpMethod, headers, body } = event;
    const origin = headers.origin || '*';
    if (httpMethod === 'OPTIONS') {
      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
        body: ''
      });
      return;
    }
    let resp, status = 200, result = {};
    const req = JSON.parse(body);
    // 优先处理 /qwen
    if (path.endsWith('/qwen')) {
      resp = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.apiKey}`,
        },
        body: JSON.stringify({ ...req, apiKey: undefined }),
      });
      status = resp.status;
      result = await resp.json();
    } else if (path.endsWith('/deepseek')) {
      resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${req.apiKey}`,
        },
        body: JSON.stringify({ ...req, apiKey: undefined }),
      });
      status = resp.status;
      result = await resp.json();
    } else {
      status = 404;
      result = { error: 'Not found' };
    }
    callback(null, {
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: JSON.stringify(result)
    });
  } catch (err) {
    console.error('Handler error:', err);
    callback(err);
  }
};

// 本地测试代码，仅在直接运行时触发
if (require.main === module) {
  module.exports.handler(
    {
      path: '/qwen',
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ apiKey: 'sk-3207b265a966424c80d520c122049db0', prompt: 'hello' })
    },
    {},
    (err, res) => {
      console.log('callback:', err, res);
      process.exit(0);
    }
  );
} 