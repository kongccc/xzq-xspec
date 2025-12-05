# 对话型AI Agent

专门用于构建对话式AI Agent的模板，支持多轮对话和上下文管理。

## 核心功能

- **多轮对话**: 支持复杂的多轮对话流程
- **上下文管理**: 智能的对话历史管理
- **情感识别**: 用户情感状态识别和响应
- **个性化**: 基于用户画像的个性化对话

## 对话流程

```
用户输入 → 意图识别 → 上下文分析 → 策略选择 → 响应生成 → 输出
```

## 对话策略

### 1. 信息获取型对话
- 问答模式
- 信息检索
- 知识查询

### 2. 任务导向型对话
- 多步骤任务
- 状态跟踪
- 进度管理

### 3. 社交型对话
- 情感交流
- 个性化互动
- 关系建立

## 快速开始

```javascript
// 初始化对话Agent
const agent = new ConversationAgent({
  memorySize: 10, // 记忆轮数
  personality: 'friendly', // 对话风格
  tools: [searchTool, calculatorTool] // 可用工具
});

// 开始对话
const response = await agent.chat('你好，我想了解天气信息');
```