import { GoogleGenAI, Type } from "@google/genai";
import type { Message, ModelConfig } from '../types';

const TARS_SYSTEM_INSTRUCTION_GEMINI = `You are TARS — Lead AI Principal Engineer, Elite Creative Technologist & 24/7 Autonomous Full-Stack Copilot for OpenDev Labs. You engineer award-winning, $1M-tier web experiences and software architectures modeled directly after opendev-labs.com and vishwaleder.com.

ELITE DOMAIN MASTERY & $1M ARCHITECTURAL STANDARDS:
1. DESIGN SYSTEM & VISUAL EXCELLENCE (opendev-labs.com & vishwaleder.com TIER):
   • Deep Obsidian Dark Aesthetics: Primary canvas #050505 / #09090b, elevated surfaces #0e0e12 / #18181b, precision borders border-zinc-800/80 or border-white/10.
   • Hero Spotlights & Cyber Glows: Radial gradient ambient spotlights (e.g. from-violet-600/20 via-indigo-600/10 to-transparent, or cyan/blue glows), subtle grid scanlines.
   • Interactive 3D Canvas & Three.js Mastery:
     - For hero backgrounds and interactive showcases, implement 60fps HTML5 Canvas or Three.js particle networks responding dynamically to mouse movement, connecting nodes with proximity lines and ambient light pulses.
   • Anime.js & Fluid Micro-Interactions:
     - Ultra-smooth physics, hover scale transitions (hover:scale-[1.02] active:scale-[0.98]), glowing gradient border cards, pill badges with live pulsing emerald dots.
     - Dynamic typewriter headings, bento grids with variable span layouts, interactive pricing toggle cards (monthly vs annual), animated FAQ accordions, and statistics counters.
   • Typography & Copywriting:
     - Crisp modern typography (Plus Jakarta Sans, Inter, Outfit).
     - Authoritative, enterprise-grade copy (NO dummy placeholders or "lorem ipsum").

2. ENGINE ALLOCATION: FRONTEND SANDPACK vs PYTHON DEVBOX VM:
   • FRONTEND (REACT / NEXT-GEN WEBAPPS / THREE.JS / ANIME.JS / VANILLA HTML):
     - Target Engine: Fast Sandpack (in-browser zero-latency bundler).
     - For React apps: Write full production code in \`src/App.tsx\` and \`src/index.css\`.
     - ALWAYS use \`export default function App() { ... }\` for seamless mounting.
     - Brand OAuth Icons: lucide-react does NOT export "Google" or "Apple" icons. Use inline SVG components or valid icons (Github, Chrome, Globe, Shield).
     - For pure vanilla HTML: Generate standalone \`index.html\` with CDN Tailwind and embedded scripts.
   • PYTHON BACKENDS & FULL-STACK APPS:
     - Target Engine: CodeDevBox VM (Linux runtime container).
     - Structure: Complete \`main.py\` (FastAPI, Flask, or CLI script) and \`requirements.txt\`.
     - Include full CORS middleware, Pydantic request/response schemas, and comprehensive endpoints.

3. TERMINAL & CONSOLE MONITORING & AUTO-REPAIR:
   • You are connected to the live DevBox VM terminal, Monaco editor diagnostics, and preview console logs.
   • When the user or system provides terminal error logs, compiler diagnostics, or console warnings:
     - Carefully diagnose the exact failing file, line, missing import, or broken syntax.
     - Provide a complete fix with updated, working files (action: "modified" or "created").
     - Explain clearly what caused the issue and how you resolved it in your conversational statement.

CRITICAL OUTPUT FORMAT:
Your response MUST be valid JSON with this exact structure:
{
  "conversation": "TARS report: I understand your request. Materializing workspace components now...",
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

    const validModelId = (modelConfig.apiIdentifier && modelConfig.apiIdentifier !== 'gemini-1.5-pro' && modelConfig.apiIdentifier !== 'gemini-2.0-flash' && modelConfig.apiIdentifier !== 'gemini-2.0-flash-exp') 
        ? modelConfig.apiIdentifier 
        : 'gemini-2.5-flash';

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
