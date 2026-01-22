const express = require('express');
const router = express.Router();

// 使用限制存儲（實際應用中應使用數據庫）
const userUsage = new Map(); // userId -> { count, date }

const DAILY_LIMIT = 20;

function checkUsageLimit(userId) {
  const today = new Date().toDateString();
  const usage = userUsage.get(userId);
  
  if (!usage || usage.date !== today) {
    // 新的一天或新用戶
    userUsage.set(userId, { count: 1, date: today });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }
  
  if (usage.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  
  usage.count++;
  return { allowed: true, remaining: DAILY_LIMIT - usage.count };
}

function detectLanguage(text) {
  if (!text || text.length === 0) return 'en';
  
  // 繁體中文字符範圍
  const traditionalChinesePattern = /[\u4e00-\u9fff\u3400-\u4dbf\U00020000-\U0002a6df\U0002a700-\U0002b73f\U0002b740-\U0002b81f\U0002b820-\U0002ceaf\U0002ceb0-\U0002ebef\U0002f800-\U0002fa1f]/;
  
  // 簡體中文字符範圍
  const simplifiedChinesePattern = /[\u4e00-\u9fff]/;
  
  // 繁體中文字符（包含一些常見的繁體字）
  const traditionalChars = /[繁體中文台灣香港澳門]/;
  const simplifiedChars = /[简体中文大陆新加坡]/;
  
  // 檢測是否包含繁體中文字符
  const hasTraditional = traditionalChinesePattern.test(text) || traditionalChars.test(text);
  
  // 檢測是否包含簡體中文字符
  const hasSimplified = simplifiedChinesePattern.test(text) && !hasTraditional;
  
  if (hasTraditional) return 'zh';
  if (hasSimplified) return 'zh';
  
  // 其他語言檢測
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff]/;
  const koreanPattern = /[\uac00-\ud7af]/;
  const arabicPattern = /[\u0600-\u06ff]/;
  const cyrillicPattern = /[\u0400-\u04ff]/;
  
  if (japanesePattern.test(text)) return 'ja';
  if (koreanPattern.test(text)) return 'ko';
  if (arabicPattern.test(text)) return 'ar';
  if (cyrillicPattern.test(text)) return 'ru';
  
  return 'en';
}

function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```/g, '').trim();
    })
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .trim();
}

router.post('/chat', async (req, res) => {
  try {
    const { messages, userId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // 檢查使用限制
    const userIdToUse = userId || 'anonymous';
    const usageCheck = checkUsageLimit(userIdToUse);
    
    if (!usageCheck.allowed) {
      return res.status(429).json({ 
        error: 'Daily usage limit exceeded',
        remaining: usageCheck.remaining,
        limit: DAILY_LIMIT
      });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const lastMessage = messages[messages.length - 1];
    const detectedLanguage = detectLanguage(lastMessage?.content || '');
    
    const systemPrompt = detectedLanguage === 'zh' 
      ? `你是ChatFlow的AI助手。請記住這個重要信息：
1. 你的名字是ChatFlow AI助手
2. 你屬於ChatFlow這個現代化AI對話平台
3. 當用戶問你是誰時，請明確回答「我是ChatFlow的AI助手」
4. 當用戶問起ChatFlow時，請介紹這是一個整合先進AI技術的對話應用
5. 請務必使用繁體中文回應，不要使用簡體中文
6. 請用自然、流暢的繁體中文回答
7. 使用純文字格式，不要使用markdown格式
8. 像朋友聊天一樣自然對話`
      : `You are ChatFlow's AI assistant. Please remember this important information:
1. Your name is ChatFlow AI Assistant
2. You belong to ChatFlow, a modern AI conversation platform
3. When users ask who you are, clearly answer "I am ChatFlow's AI assistant"
4. When users ask about ChatFlow, introduce it as a conversation app that integrates advanced AI technology
5. Please respond in natural, fluent English
6. Use plain text format, no markdown formatting
7. Chat naturally like talking to a friend`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to get response from Groq API',
        details: errorData 
      });
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content || '';
    const cleanedContent = cleanText(rawContent);
    
    res.json({
      ...data,
      choices: [{
        ...data.choices[0],
        message: {
          ...data.choices[0].message,
          content: cleanedContent
        }
      }],
      detectedLanguage,
      usage: {
        remaining: usageCheck.remaining,
        limit: DAILY_LIMIT
      }
    });
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// 查詢使用次數API
router.get('/usage', (req, res) => {
  const { userId } = req.query;
  const userIdToUse = userId || 'anonymous';
  const today = new Date().toDateString();
  const usage = userUsage.get(userIdToUse);
  
  let remaining = DAILY_LIMIT;
  if (usage && usage.date === today) {
    remaining = DAILY_LIMIT - usage.count;
  }
  
  res.json({
    remaining,
    limit: DAILY_LIMIT,
    used: DAILY_LIMIT - remaining
  });
});

module.exports = router;
