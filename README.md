# 文件自动分类工具

这是一个轻量级的文件自动分类工具，可以根据文件扩展名、文件名和内容自动将文件分类到相应的文件夹中。

## 功能特点

- 支持多种文件类型的自动分类
- 基于文件扩展名和内容进行分类
- 支持自定义分类规则
- 自动处理文件名冲突
- 详细的日志记录
- 跨平台支持（Windows/macOS）
- 进度条显示
- **可选：支持大模型API智能内容分类**

## 安装步骤

1. 确保已安装Python 3.7或更高版本
2. 安装依赖包：
   ```bash
   pip install -r requirements.txt
   ```

## 使用方法

1. 直接运行Python脚本：
   ```bash
   python file_organizer.py <源目录路径>
   ```

2. 使用打包后的exe文件（Windows）：
   ```bash
   file_organizer.exe <源目录路径>
   ```

## 智能内容分类（大模型API，可选）

本工具支持调用主流大模型API（如OpenAI ChatGPT、DeepSeek、阿里通义千问）对文件内容进行智能分类。

### 配置方法
1. 在项目根目录下找到或新建 `llm_config.json` 文件，内容如下：
   ```json
   {
     "llm_provider": "openai",   // 可选：openai, deepseek, tongyi
     "llm_api_key": "你的API_KEY",
     "llm_api_base": "",           // 可选，部分平台需自定义base url
     "llm_model": ""               // 可选，默认模型
   }
   ```
2. 不填写或不配置API Key时，程序自动回退本地规则，不会报错。
3. 支持扩展更多大模型，只需在 `file_organizer.py` 的 `classify_with_llm` 方法中添加分支即可。

### 推荐免费/有免费额度的大模型API
- **OpenAI ChatGPT**（https://platform.openai.com/）：注册有免费试用额度，需科学上网。
- **DeepSeek**（https://platform.deepseek.com/）：注册即送免费额度。
- **阿里通义千问（Qwen）**（https://dashscope.aliyun.com/）：阿里云账号注册，免费额度。
- **百度文心一言**（https://cloud.baidu.com/product/wenxinworkshop）：百度云账号注册，免费额度。
- **智谱清言GLM**（https://open.bigmodel.cn/）：注册即送免费额度。
- **讯飞星火**（https://xinghuo.xfyun.cn/）：注册即送免费额度。
- **月之暗面Kimi**（https://kimi.moonshot.cn/）：需申请API。

> 你可以根据自己的需求和地区选择合适的大模型平台，注册获取API Key。

### 安全与隐私
- 本工具不会上传你的文件内容，所有API调用均在本地发起，API Key只保存在本地。
- 不配置API Key时不会消耗任何大模型额度。

## 自定义分类规则

可以通过修改`categories.json`文件来自定义分类规则。文件格式如下：

```json
{
    "分类名称": {
        "extensions": [".扩展名1", ".扩展名2"],
        "keywords": ["关键词1", "关键词2"]
    }
}
```

## 注意事项

1. 建议在运行前备份重要文件
2. 程序会自动跳过已经分类的文件夹
3. 如果目标位置已存在同名文件，会自动添加数字后缀
4. 所有操作都会记录在`file_organizer.log`文件中

## 打包成exe（Windows）

使用以下命令将程序打包成exe文件：

```bash
pyinstaller --onefile file_organizer.py
```

打包后的exe文件将在`dist`目录中生成。

## 常见问题

1. 如果遇到权限问题，请以管理员身份运行
2. 如果文件分类不准确，可以修改`categories.json`中的关键词
3. 如果程序运行缓慢，这是正常的，因为需要读取和分析文件内容

## 安全提示

- 程序不会删除任何文件，只会移动文件位置
- 建议在运行前备份重要文件
- 程序会记录所有操作到日志文件中，方便追踪问题 