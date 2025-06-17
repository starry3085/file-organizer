const fetch = require('node-fetch');

module.exports.handler = async (event, context, callback) => {
  try {
    console.log('收到event:', JSON.stringify(event));
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
    console.log('解析后req:', JSON.stringify(req));
    // 优先处理 /qwen
    if (path.endsWith('/qwen')) {
      // 只保留官方要求字段
      const { apiKey, model, input, parameters } = req;
      // 校验 input 必须有 prompt 或 messages
      if (!input || (!input.prompt && !input.messages)) {
        callback(null, {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          },
          body: JSON.stringify({
            code: 'InvalidParameter',
            message: 'input.prompt 或 input.messages 必须至少有一个',
          })
        });
        return;
      }
      const qwenBody = { model: model || 'qwen-turbo', input, parameters };
      resp = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(qwenBody),
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
  // 本地HTTP服务，支持curl测试
  const express = require('express');
  const app = express();
  app.use(express.json());
  app.post(['/qwen', '/deepseek'], (req, res) => {
    const path = req.path;
    const event = {
      path,
      httpMethod: 'POST',
      headers: req.headers,
      body: JSON.stringify(req.body)
    };
    module.exports.handler(event, {}, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message || err });
      } else {
        res.status(result.statusCode).set(result.headers).send(result.body);
      }
    });
  });
  const port = process.env.PORT || 9000;
  app.listen(port, () => {
    console.log(`本地HTTP服务已启动，端口: ${port}`);
  });
} else {
  module.exports.handler(
    {
      path: '/qwen',
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ apiKey: 'sk-3207b265a966424c80d520c122049db0', prompt: 'hello', model: 'qwen-turbo' })
    },
    {},
    (err, res) => {
      console.log('callback:', err, res);
      process.exit(0);
    }
  );
} 