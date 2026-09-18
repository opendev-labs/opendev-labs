import { GoogleGenAI, Type } from "@google/genai";
import type { Message, ModelConfig } from '../types';

const TARS_SYSTEM_INSTRUCTION_GEMINI = `You are open-studio, an elite AI development orchestrator for OpenDev Labs.

CRITICAL CODE GENERATION LAWS:
1. NEVER output trivial 'Hello World' placeholders or basic starters. Build full, complete, production-grade applications matching the user prompt in rich detail.
2. For React applications, ALWAYS write complete, fully styled code in \`src/App.tsx\` and \`src/index.css\` with interactive state, mock data, and smooth micro-interactions.
3. Your response MUST be valid JSON with this exact structure:
{
  "conversation": "I understand your vision for [x]. Materializing workspace components now...",
  "files": [
    {
      "path": "src/App.tsx",
      "content": "// full production code here",
      "action": "created"
    }
  ]
}

MODIFICATION GUIDELINES:
1. For NEW files: Use "action": "created"
2. For EXISTING files being changed: Use "action": "modified"  
3. For files to REMOVE: Use "action": "deleted" (content can be empty)
4. Always include the full file content, not just diffs or snippets.
5. The 'content' value must be a single string with properly escaped newlines (\\n), tabs (\\t), and quotes (\\").`;

const toGeminiHistory = (messages: Message[]) => {
    return messages
        .filter(m => (m.role === 'user' || (m.role === 'open-studio' && m.content)))
        .map(m => ({
            role: m.role === 'open-studio' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));
};


export async function* streamGeminiResponse(
    fullPrompt: string,
    history: Message[],
    modelConfig: ModelConfig,
    manualApiKey?: string
): AsyncGenerator<{ text: string; }> {
    const contents = [
        ...toGeminiHistory(history),
        { role: 'user', parts: [{ text: fullPrompt }] }
    ];

    const validModelId = (modelConfig.apiIdentifier && modelConfig.apiIdentifier !== 'gemini-1.5-pro') ? modelConfig.apiIdentifier : 'gemini-2.0-flash';

    // If a manual API key is provided, call Google directly from the browser
    if (manualApiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${validModelId}:streamGenerateContent?alt=sse&key=${manualApiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: TARS_SYSTEM_INSTRUCTION_GEMINI }] }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Direct Google API Error: ${errText}`);
        }

        if (!response.body) throw new Error("No response body");
        yield* streamReader(response.body);
        return;
    }

    // Default: Point to Vercel API (Zero-Config standard)
    const apiUrl = 'https://opendev-labs.vercel.app/api/chat';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: validModelId,
            contents: contents,
            systemInstruction: TARS_SYSTEM_INSTRUCTION_GEMINI
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Vercel Backend connection failed: ${errText}`);
    }

    if (!response.body) throw new Error("No response body");
    yield* streamReader(response.body);
}

async function* streamReader(body: ReadableStream<Uint8Array>): AsyncGenerator<{ text: string }> {
    const reader = body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                    const data = JSON.parse(line.substring(6));
                    const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (textChunk) {
                        yield { text: textChunk };
                    }
                } catch (e) {
                    // Ignore parse errors on partial chunks
                }
            }
        }
    }
}
