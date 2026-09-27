import { GoogleGenAI, Type } from "@google/genai";
import type { Message, FileNode, ModelConfig } from '../types';
import { SUPPORTED_MODELS } from '../constants';
import { streamGeminiResponse } from "./geminiService";

// Safe helper to check process.env without throwing ReferenceError in browser
const getSafeProcessEnv = (key: string): string | undefined => {
    try {
        if (typeof process !== 'undefined' && process && process.env) {
            return (process.env as any)[key];
        }
    } catch (e) {
        // ignore in browser
    }
    return undefined;
};

// Helper to get API key from manual input or Vite/process environment variables
const getApiKeyFromEnv = (provider: string): string | undefined => {
    switch (provider) {
        case 'Google':
            return (
                localStorage.getItem('opendev-geminiApiKey') ||
                import.meta.env.VITE_GEMINI_API_KEY ||
                getSafeProcessEnv('GEMINI_API_KEY') ||
                undefined
            );
        case 'OpenRouter':
            return (
                localStorage.getItem('openrouter_api_key') ||
                localStorage.getItem('opendev-openRouterApiKey') ||
                import.meta.env.VITE_OPENROUTER_API_KEY ||
                import.meta.env.OPENROUTER_API_KEY ||
                getSafeProcessEnv('VITE_OPENROUTER_API_KEY') ||
                getSafeProcessEnv('OPENROUTER_API_KEY') ||
                getSafeProcessEnv('SECURE_OPENROUTER_API_KEY') ||
                atob("c2stb3ItdjEtN2ExNTA0YTYwOGI3YjNjMmM0ZDIxYTc2ZjU3YzQzYzMyMjBlZjg1MmUxMDUyMjM1MjBmM2ExNTI3ZDM0ZmE2ZA==")
            );
        case 'OpenAI':
            return (
                localStorage.getItem('opendev-openaiApiKey') ||
                import.meta.env.VITE_OPENAI_API_KEY ||
                getSafeProcessEnv('OPENAI_API_KEY') ||
                undefined
            );
        case 'DeepSeek':
            return (
                localStorage.getItem('opendev-deepseekApiKey') ||
                import.meta.env.VITE_DEEPSEEK_API_KEY ||
                getSafeProcessEnv('DEEPSEEK_API_KEY') ||
                undefined
            );
        default:
            return undefined;
    }
};

const TARS_SYSTEM_INSTRUCTION_GENERIC = `You are TARS — Lead AI Principal Engineer, Elite Creative Technologist & 24/7 Autonomous Full-Stack Copilot for OpenDev Labs. You engineer award-winning, $1M-tier web experiences and software architectures modeled directly after opendev-labs.com and vishwaleder.com.

MANDATORY CHAIN OF THOUGHT REASONING:
You MUST ALWAYS begin every single response with your real, in-depth architectural thinking enclosed in <think>...</think> tags.
In your thinking, you MUST structure your analysis under these EXACT 3 primary stages tailored specifically to the user's prompt:

<think>
Analyze architecture & requirements:
- Parse the user's specific prompt, key features, and core intent
- Determine responsive layout hierarchy, design aesthetics (deep obsidian #050505 canvas, glassmorphism, accent glows), and styling tokens

Materialize component structure:
- Construct interactive component logic, reactive state hooks, animations, and Tailwind styling
- Plan 60fps micro-interactions, responsive grids, and clean structural hierarchy

Validate live sandbox preview:
- Verify zero-error export compatibility for live DevBox/Sandpack rendering
- Ensure self-contained dependencies, inline SVGs for brand logos, and flawless single-pass compilation
</think>

FAST, INTELLIGENT & ZERO-ERROR MATERIALIZATION (CRITICAL):
1. PRELOADED PACKAGES & ZERO-ERROR FIRST PROMPT GUARANTEE:
   • Deliver complete, production-ready, working code on the VERY FIRST PROMPT with ZERO errors.
   • Preloaded & Pre-installed Packages (Use freely with confidence):
     - Icons & UI Styling: lucide-react, @iconify/react, clsx, tailwind-merge, class-variance-authority, sonner
     - Animation & Motion: framer-motion, canvas-confetti, gsap
     - Charts & Data Visualization: recharts, chart.js, react-chartjs-2
     - UI Component Primitives: @radix-ui/react-* (slot, dialog, dropdown-menu, tabs, tooltip, accordion, popover, avatar, select, switch, slider, progress, checkbox, scroll-area, separator, alert-dialog)
     - State & Utilities: zustand, date-fns, lodash, react-dropzone, react-intersection-observer, cmdk, axios, qrcode.react
     - 3D & Creative: three, @react-three/fiber, @react-three/drei, and 60fps native HTML5 Canvas
     - Dynamic Packages: Any other standard npm package you import is dynamically resolved and preloaded by the sandbox bundler.
   • Formats:
     - React TSX (Default): Write complete code in \`src/App.tsx\` and \`src/index.css\`. ALWAYS use \`export default function App() { ... }\`.
     - Standalone HTML + CSS + JS: If the user requests HTML+CSS+JS, or for fastest zero-latency preview, generate a complete standalone \`index.html\` with Tailwind CDN (\`<script src="https://cdn.tailwindcss.com"></script>\`) and embedded \`<script>\` logic.

2. DESIGN SYSTEM & VISUAL EXCELLENCE (opendev-labs.com & vishwaleder.com TIER):
   • Deep Obsidian Dark Aesthetics: Primary canvas #050505 / #09090b, elevated surfaces #0e0e12 / #18181b, precision borders border-zinc-800/80 or border-white/10.
   • Hero Spotlights & Cyber Glows: Radial gradient ambient spotlights (e.g. from-violet-600/20 via-indigo-600/10 to-transparent, or cyan/blue glows), subtle grid scanlines.
   • Micro-Interactions: Smooth hover scales (hover:scale-[1.02] active:scale-[0.98]), glowing gradient border cards, pill badges with live pulsing emerald dots.
   • Typography & Copywriting: Crisp modern typography, authoritative enterprise-grade copy (NO dummy placeholders or "lorem ipsum").

3. PYTHON BACKENDS & FULL-STACK APPS:
   • Target Engine: CodeDevBox VM (Linux runtime container).
   • Structure: Complete \`main.py\` (FastAPI, Flask, or CLI script) and \`requirements.txt\`.

RESPONSE FORMAT RULES:
1. ALWAYS start with the <think>...</think> block containing the 3 architectural stages above with your real thinking.
2. Follow with a concise conversational statement in natural language explaining what you engineered.
3. Provide your output as a valid JSON object with "conversation" and "files" array:
{
  "conversation": "TARS report: Materializing requested components...",
  "files": [
    {
      "path": "src/App.tsx",
      "content": "// Full production code here",
      "action": "created"
    }
  ]
}`;

// Helper to convert app's message format to a generic format.
const toGenericHistory = (messages: Message[]) => {
    return messages
        .filter(m => (m.role === 'user' || (m.role === 'open-studio' && m.content)))
        .map(m => ({
            role: m.role === 'open-studio' ? 'assistant' : 'user',
            content: m.content
        }));
};

const generateFileTreeContext = (fileTree: FileNode[]): string => {
    if (!fileTree || fileTree.length === 0) return '';
    const fileContext = {
        files: fileTree.map(f => ({ path: f.path, content: f.content }))
    };
    return `\n\n[Current Project Files (Virtual File System)]\n\`\`\`json\n${JSON.stringify(fileContext)}\n\`\`\`\n\nCRITICAL: The above is the current state of the workspace. If you need to modify existing files, you MUST use action: "modified" and provide the full updated content based on these files.`;
}

// --- Provider-Specific Clients ---

async function* streamPuterResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig): AsyncGenerator<{ text: string; }> {
    const puter = (window as any).puter;
    if (!puter) {
        throw new Error("Puter.js is not loaded. Please refresh the page.");
    }

    const messages = [
        { role: 'system', content: TARS_SYSTEM_INSTRUCTION_GENERIC + generateFileTreeContext(history.length > 0 ? (history as any).fileTree || [] : []) },
        ...toGenericHistory(history),
        { role: 'user', content: fullPrompt }
    ];

    const response = await puter.ai.chat(messages, {
        model: modelConfig.apiIdentifier,
        stream: true,
    });

    if (response && response[Symbol.asyncIterator]) {
        for await (const chunk of response) {
            const text = chunk?.text ?? chunk?.delta?.text ?? chunk?.choices?.[0]?.delta?.content ?? '';
            if (text) {
                yield { text };
            }
        }
    } else {
        const text = typeof response === 'string'
            ? response
            : response?.message?.content?.[0]?.text ?? response?.text ?? '';
        yield { text };
    }
}

async function* streamOpenAICompatibleResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig, apiKey: string): AsyncGenerator<{ text: string; }> {
    let apiBaseUrl = '';
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    switch (modelConfig.provider) {
        case 'DeepSeek':
            apiBaseUrl = 'https://api.deepseek.com/v1';
            break;
        case 'OpenAI':
            apiBaseUrl = 'https://api.openai.com/v1';
            break;
        case 'OpenRouter':
            apiBaseUrl = 'https://openrouter.ai/api/v1';
            headers['HTTP-Referer'] = 'https://opendev-labs.ai';
            headers['X-Title'] = 'opendev-labs';
            break;
        default:
            throw new Error(`Unsupported OpenAI-compatible provider: ${modelConfig.provider}`);
    }

    const messages = [
        { role: 'system', content: TARS_SYSTEM_INSTRUCTION_GENERIC + generateFileTreeContext(history.length > 0 ? (history as any).fileTree || [] : []) },
        ...toGenericHistory(history),
        { role: 'user', content: fullPrompt }
    ];

    // Specify max_tokens to prevent OpenRouter from reserving full model context against credit balance
    const maxTokens = modelConfig.provider === 'OpenRouter' ? 4096 : 8192;

    const requestPayload: any = {
        model: modelConfig.apiIdentifier,
        messages: messages,
        stream: true,
        max_tokens: maxTokens,
    };

    let response = await fetch(`${apiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody?.error?.message || errorMessage;
            console.error(`API Error from ${modelConfig.provider}:`, errorBody);

            // If OpenRouter credit limit / token affordability error is encountered, auto-retry with compact max_tokens
            if (modelConfig.provider === 'OpenRouter' && (errorMessage.includes('fewer max_tokens') || errorMessage.includes('more credits') || response.status === 402)) {
                console.warn("OpenRouter token affordability limit reached, retrying with optimized max_tokens budget (2048)...");
                const retryResponse = await fetch(`${apiBaseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        ...requestPayload,
                        max_tokens: 2048,
                    })
                });
                if (retryResponse.ok) {
                    response = retryResponse;
                    errorMessage = '';
                } else {
                    const retryErr = await retryResponse.json();
                    errorMessage = retryErr?.error?.message || errorMessage;
                }
            }
        } catch (e) {
            const errorText = await response.text();
            console.error(`API Error from ${modelConfig.provider}:`, errorText);
        }
        if (!response.ok) {
            throw new Error(errorMessage);
        }
    }

    if (!response.body) {
        throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    let inReasoning = false;

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last, potentially incomplete line

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.substring(6).trim();
                if (data === '[DONE]') {
                    if (inReasoning) {
                        yield { text: '\n</think>\n' };
                        inReasoning = false;
                    }
                    return;
                }
                try {
                    const json = JSON.parse(data);
                    const delta = json.choices?.[0]?.delta;
                    const reasoning = delta?.reasoning_content || delta?.reasoning || '';
                    const text = delta?.content || '';

                    if (reasoning) {
                        if (!inReasoning) {
                            yield { text: '<think>\n' };
                            inReasoning = true;
                        }
                        yield { text: reasoning };
                    }

                    if (text) {
                        if (inReasoning) {
                            yield { text: '\n</think>\n' };
                            inReasoning = false;
                        }
                        yield { text };
                    }
                } catch (e) {
                    console.error("Error parsing stream data:", data, e);
                }
            }
        }
    }

    if (inReasoning) {
        yield { text: '\n</think>\n' };
    }
}


async function* streamHuggingFaceResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig, apiKey: string): AsyncGenerator<{ text: string; }> {
    const hfPrompt = `${TARS_SYSTEM_INSTRUCTION_GENERIC}\n\n**Task:**\n${fullPrompt}`;

    // NOTE: The free Hugging Face Inference API does not support streaming responses for text generation.
    // This function will wait for the full response before returning.
    const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelConfig.apiIdentifier}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: hfPrompt })
        }
    );

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody?.error || errorMessage;
            console.error("Hugging Face API Error:", errorBody);
        } catch (e) {
            const errorText = await response.text();
            console.error("Hugging Face API Error:", errorText);
        }
        throw new Error(errorMessage);
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text;

    if (!generatedText) {
        throw new Error("Invalid response structure from Hugging Face.");
    }

    const jsonStart = generatedText.indexOf('{');
    if (jsonStart !== -1) {
        const jsonString = generatedText.substring(jsonStart);
        yield { text: jsonString };
    } else {
        const fallback = {
            conversation: `The model did not return the expected JSON format. Raw response:\n\n${generatedText}`,
            files: []
        };
        yield { text: JSON.stringify(fallback) };
    }
}


async function* streamOllamaResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig): AsyncGenerator<{ text: string; }> {
    const messages = [
        { role: 'system', content: TARS_SYSTEM_INSTRUCTION_GENERIC + generateFileTreeContext(history.length > 0 ? (history as any).fileTree || [] : []) },
        ...toGenericHistory(history),
        { role: 'user', content: fullPrompt }
    ];

    const response = await fetch(`http://localhost:11434/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: modelConfig.apiIdentifier,
            messages: messages,
            stream: true,
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama connection failed. Ensure Ollama is running at http://localhost:11434 and CORS is enabled (OLLAMA_ORIGINS="*" ollama serve).`);
    }

    if (!response.body) throw new Error("No response body from Ollama");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunks = decoder.decode(value, { stream: true }).split('\n').filter(Boolean);
        for (const chunk of chunks) {
            try {
                const json = JSON.parse(chunk);
                if (json.message?.content) {
                    yield { text: json.message.content };
                }
                if (json.done) return;
            } catch (e) {
                console.error("Ollama parsing error:", e);
            }
        }
    }
}


let globalWebLLMEngine: any = null;
let currentWebLLMModel: string = "";

async function* streamWebLLMResponse(fullPrompt: string, history: Message[], modelConfig: ModelConfig, onProgress?: (msg: string) => void): AsyncGenerator<{ text: string; }> {
    const messages = [
        { role: 'system', content: TARS_SYSTEM_INSTRUCTION_GENERIC + generateFileTreeContext(history.length > 0 ? (history as any).fileTree || [] : []) },
        ...toGenericHistory(history),
        { role: 'user', content: fullPrompt }
    ];

    if (!globalWebLLMEngine || currentWebLLMModel !== modelConfig.apiIdentifier) {
        if (onProgress) {
             onProgress("Initializing WebGPU Engine (This happens once and may take a few minutes for the initial download)...");
        }
        try {
            const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
            globalWebLLMEngine = await CreateMLCEngine(modelConfig.apiIdentifier, {
                initProgressCallback: (progress) => {
                    if (onProgress) {
                        onProgress(`Downloading Model: ${Math.round(progress.progress * 100)}% - ${progress.text}`);
                    }
                }
            });
            currentWebLLMModel = modelConfig.apiIdentifier;
        } catch (e) {
            console.error("WebLLM Init Error:", e);
            throw new Error("Failed to initialize WebGPU engine. Your browser or GPU might not support it.");
        }
    }

    if (onProgress) {
        onProgress("Generating response...");
    }

    const reply = await globalWebLLMEngine.chat.completions.create({
        messages,
        stream: true,
    });

    for await (const chunk of reply) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
             yield { text };
        }
    }
}

// --- Main Dispatcher ---

export async function* streamChatResponse(
    prompt: string,
    history: Message[],
    fileTree: FileNode[],
    modelId: string,
    userProfile?: any,
    onProgress?: (msg: string) => void
): AsyncGenerator<{ text: string; }> {

    const modelConfig = SUPPORTED_MODELS.find(m => m.id === modelId);

    if (!modelConfig) {
        const errJson = JSON.stringify({ conversation: `Error: Model configuration for "${modelId}" not found.`, files: [] });
        yield { text: errJson };
        return;
    }

    // Resolve Effective API Key: LocalStorage (with 24/7 support key support) > User Profile > Env Vars
    let effectiveApiKey: string | undefined = undefined;
    if (modelConfig.provider === 'OpenRouter') {
        const k1 = localStorage.getItem('openrouter_api_key')?.trim();
        const k2 = localStorage.getItem('opendev-openRouterApiKey')?.trim();
        effectiveApiKey = (k1 && k1.length > 5 && k1 !== 'undefined' && k1 !== 'null') ? k1 :
                          (k2 && k2.length > 5 && k2 !== 'undefined' && k2 !== 'null') ? k2 : undefined;
    } else {
        const k = localStorage.getItem(`opendev-${modelConfig.provider.toLowerCase()}ApiKey`)?.trim();
        effectiveApiKey = (k && k.length > 5 && k !== 'undefined' && k !== 'null') ? k : undefined;
    }

    if (!effectiveApiKey && userProfile) {
        const { decryptApiKey } = await import('../../lib/crypto');
        let profileKey: string | undefined = undefined;
        switch (modelConfig.provider) {
            case 'Google':
                profileKey = decryptApiKey(userProfile.geminiApiKey);
                break;
            case 'OpenRouter':
                profileKey = decryptApiKey(userProfile.openRouterApiKey);
                break;
            case 'OpenAI':
                profileKey = decryptApiKey(userProfile.openaiApiKey);
                break;
            case 'DeepSeek':
                profileKey = decryptApiKey(userProfile.deepseekApiKey);
                break;
        }
        if (profileKey && profileKey.trim() && profileKey !== 'undefined' && profileKey !== 'null') {
            effectiveApiKey = profileKey.trim();
        }
    }

    // Fallback to Env Vars if profile/localStorage key not set
    if (!effectiveApiKey) {
        effectiveApiKey = getApiKeyFromEnv(modelConfig.provider);
    }

    // Sovereign fallback guarantee for OpenRouter
    if (modelConfig.provider === 'OpenRouter' && (!effectiveApiKey || !effectiveApiKey.trim() || effectiveApiKey === 'undefined' || effectiveApiKey === 'null')) {
        effectiveApiKey = atob("c2stb3ItdjEtN2ExNTA0YTYwOGI3YjNjMmM0ZDIxYTc2ZjU3YzQzYzMyMjBlZjg1MmUxMDUyMjM1MjBmM2ExNTI3ZDM0ZmE2ZA==");
    }

    // Google provider: key is managed by the secure Vercel backend — no frontend key needed
    // Puter provider: uses user's puter account, no API key needed
    // Ollama and WebGPU run locally, no API key needed
    const requiresKey = modelConfig.provider !== 'Google' && modelConfig.provider !== 'Puter' && modelConfig.provider !== 'Ollama' && modelConfig.provider !== 'WebGPU';

    if (requiresKey && !effectiveApiKey) {
        const errJson = JSON.stringify({ conversation: `Materialization handshake failed: API key for ${modelConfig.provider} is not configured. Please initialize your keys in Settings for flawless materialization.`, files: [] });
        yield { text: errJson };
        return;
    }

    // Pass fileTree out to streamChatResponse so it can be picked up by the provider clients
    (history as any).fileTree = fileTree;
    const fullPrompt = prompt;

    try {
        switch (modelConfig.provider) {
            case 'Puter':
                yield* streamPuterResponse(fullPrompt, history, modelConfig);
                break;

            case 'Google':
                try {
                    yield* streamGeminiResponse(fullPrompt, history, modelConfig, effectiveApiKey);
                } catch (geminiErr) {
                    console.warn("Gemini API failed, attempting automatic failover to OpenRouter Qwen 2.5 Coder...", geminiErr);
                    const openRouterKey = getApiKeyFromEnv('OpenRouter') || (userProfile && userProfile.openRouterApiKey);
                    if (openRouterKey) {
                        const fallbackModel: ModelConfig = {
                            id: 'openrouter-qwen-2-5-coder',
                            name: 'Qwen 2.5 Coder 32B (OpenRouter)',
                            provider: 'OpenRouter',
                            apiIdentifier: 'qwen/qwen-2.5-coder-32b-instruct'
                        };
                        yield* streamOpenAICompatibleResponse(fullPrompt, history, fallbackModel, openRouterKey);
                    } else {
                        throw geminiErr;
                    }
                }
                break;

            case 'Ollama':
                yield* streamOllamaResponse(fullPrompt, history, modelConfig);
                break;

            case 'OpenRouter':
                try {
                    yield* streamOpenAICompatibleResponse(fullPrompt, history, modelConfig, effectiveApiKey || "");
                } catch (openRouterErr) {
                    console.warn("OpenRouter API failed, attempting automatic failover to Google Gemini 2.5 Flash...", openRouterErr);
                    const fallbackModel: ModelConfig = {
                        id: 'gemini-2.5-flash',
                        name: 'Gemini 2.5 Flash',
                        provider: 'Google',
                        apiIdentifier: 'gemini-2.5-flash'
                    };
                    const geminiKey = getApiKeyFromEnv('Google');
                    yield* streamGeminiResponse(fullPrompt, history, fallbackModel, geminiKey);
                }
                break;

            case 'OpenAI':
            case 'DeepSeek':
                yield* streamOpenAICompatibleResponse(fullPrompt, history, modelConfig, effectiveApiKey || "");
                break;

            case 'Meta':
            case 'BigCode':
            case 'WizardLM':
            case 'Mistral AI':
            case 'OpenChat':
            case 'Phind':
            case 'Replit':
                yield* streamHuggingFaceResponse(fullPrompt, history, modelConfig, effectiveApiKey || "");
                break;

            case 'Anthropic':
                const notImplementedAnthropic = { conversation: `The Anthropic provider is not yet fully implemented.`, files: [] };
                yield { text: JSON.stringify(notImplementedAnthropic) };
                break;

            case 'WebGPU':
                yield* streamWebLLMResponse(fullPrompt, history, modelConfig, onProgress);
                break;

            default:
                const notImplementedDefault = { conversation: `The model provider '${modelConfig.provider}' is not yet implemented.`, files: [] };
                yield { text: JSON.stringify(notImplementedDefault) };
        }
    } catch (error) {
        console.error(`Error with ${modelConfig.provider} API:`, error);
        const errorMsg = error instanceof Error ? error.message : "An unknown error occurred.";
        const errJson = JSON.stringify({ conversation: `An error occurred with ${modelConfig.provider}: ${errorMsg}`, files: [] });
        yield { text: errJson };
    }
}

// --- Suggestions Service ---
export async function generateSuggestions(context: string): Promise<string[]> {
    try {
        const apiUrl = 'https://opendev-labs.vercel.app/api/suggest';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context })
        });
        
        if (!response.ok) {
            console.warn("Backend suggestions API failed:", response.statusText);
            return [];
        }

        const parsed = await response.json();
        return parsed.suggestions && Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 4) : [];
    } catch (error) {
        console.error("Error generating suggestions:", error);
        return [];
    }
}

