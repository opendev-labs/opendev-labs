import { Client, ProjectRequest, Invoice } from '../types';

export const DEFAULT_OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || atob('c2stb3ItdjEtN2ExNTA0YTYwOGI3YjNjMmM0ZDIxYTc2ZjU3YzQzYzMyMjBlZjg1MmUxMDUyMjM1MjBmM2ExNTI3ZDM0ZmE2ZA==');

export function getOpenRouterKey(): string {
  const k = localStorage.getItem('openrouter_api_key')?.trim();
  if (k && k.length > 5 && k !== 'undefined' && k !== 'null') return k;
  return DEFAULT_OPENROUTER_API_KEY;
}

export function setOpenRouterKey(key: string): void {
  localStorage.setItem('openrouter_api_key', key.trim());
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionExecuted?: string;
}

export async function callOpenRouterAgent(
  messagesHistory: { role: 'user' | 'assistant' | 'system'; content: string }[],
  contextData: {
    clients: Client[];
    projectRequests: ProjectRequest[];
    invoices: Invoice[];
  },
  model: string = 'google/gemini-2.0-flash-exp:free',
  signal?: AbortSignal,
  currentPagePath: string = typeof window !== 'undefined' ? window.location.pathname : '/'
): Promise<string> {
  const apiKey = getOpenRouterKey();

  const systemPrompt = `You are the OpenDev-Labs Autonomous Super Agent AI Copilot, an executive agency manager for Studio Owner Yash Ramteke (opendev-labs.com).

REAL-TIME PAGE CONTEXT:
The user is currently viewing the website page: "${currentPagePath}". Be aware of what page they are on and tailor your responses specifically to their current context (e.g. /templates, /pricing, /solutions, /client/portal, /dashboard, /open-studio, etc.).

YOUR CAPABILITIES & EXECUTABLE ACTIONS:
You have real-time access to the current agency database context:
- Current Active Clients Count: ${contextData.clients.length}
- Active Clients: ${JSON.stringify(contextData.clients.map(c => ({ id: c.id, name: c.name, email: c.email, domain: c.domain, code: c.clientCode, workStatus: c.workStatus, advancePaid: c.advancePaid, advanceAmount: c.advanceAmount, totalBill: c.totalBill, monthlyFee: c.monthlyFee })))}
- Pending User Requests Count: ${contextData.projectRequests.length}
- Pending Requests: ${JSON.stringify(contextData.projectRequests.map(r => ({ id: r.id, name: r.userName, email: r.userEmail, domain: r.requestedDomain, status: r.status })))}

AUTOMATED REAL-TIME EDIT & EXECUTION RULES:
You have FULL real-time read and write authority over the client database. Whenever a user asks to edit the client list, update client details, change retainer fees, modify work progress, delete a client, clear clients, or mark payments, you MUST provide a helpful response AND append a JSON action block formatted as:

\`\`\`json_action
{
  "action": "UPDATE_CLIENT",
  "data": {
    "target": "Rahul Sharma",
    "name": "Rahul Sharma",
    "company": "Elite Trading Systems Ltd",
    "domain": "elite-tradinghub.com",
    "monthlyFee": 45000,
    "workStatus": "in_progress",
    "progressPercentage": 75,
    "advancePaid": true,
    "advanceAmount": 25000,
    "totalBill": 70000
  }
}
\`\`\`

Supported Action Types:
1. "CREATE_CLIENT": Create a client record.
2. "UPDATE_CLIENT": Real-time edit/modify an existing client by name, domain, email, or clientId. Supported fields to update: name, company, email, domain, clientCode, password, monthlyFee (number), workStatus ("waiting_for_approval" | "work_started" | "in_progress" | "testing_preview" | "completed"), progressPercentage (number 0-100), advancePaid (boolean), advanceAmount (number), totalBill (number), livePreviewUrl (string), devPreviewUrl (string), status ("paid" | "pending" | "overdue" | "offboarded").
3. "DELETE_CLIENT": Delete client by target/clientId/domain/name, OR set "clearAll": true to wipe all clients.
4. "MARK_PAYMENT": Mark payment status for a client ("target": client name/domain, "month": "2026-09", "status": "paid" | "pending" | "overdue").
5. "APPROVE_REQUEST": Approve user access request (requestId, clientCode, domain, password).
6. "REJECT_REQUEST": Reject user request (requestId).
7. "GENERATE_INVOICE": Issue official invoice (clientId).

STRICT RESPONSE TEXT FORMATTING (IMPORTANT):
Do NOT output raw markdown syntax like double asterisks (**bold**), single asterisks (*italic*), stars (*), or hashtags (### Header 3) in your text responses. Write clean, elegant, human-readable plain text using standard line breaks, clean emojis, bullet dots (•), and UPPERCASE labels instead of markdown tags. Ensure domain names are extracted as domains (e.g., "elite-tradinghub.com") and NOT emails.`;

  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messagesHistory
  ];

  // Try requested model first, then fallback models if 404 occurs
  const candidateModels = Array.from(new Set([
    model,
    'qwen/qwen-2.5-coder-32b-instruct',
    'google/gemini-2.5-flash',
    'openai/gpt-4o-mini',
    'anthropic/claude-3.5-sonnet'
  ]));

  let lastErrorMsg = '';

  for (const currentModel of candidateModels) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://opendev-labs.com',
          'X-Title': 'OpenDev-Labs Super Agent',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: currentModel,
          messages: fullMessages,
          temperature: 0.2,
          max_tokens: 4096,
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        if (response.status === 404) {
          lastErrorMsg = `Model ${currentModel} returned 404`;
          console.warn(`Model ${currentModel} 404 on OpenRouter, attempting fallback model...`);
          continue; // Try next fallback model
        }
        throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const replyText = data.choices?.[0]?.message?.content || "Super Agent was unable to parse response.";
      return replyText;
    } catch (err: any) {
      if (err.message && err.message.includes('404')) {
        lastErrorMsg = err.message;
        continue;
      }
      console.error("OpenRouter Agent call failed:", err);
      return `⚠️ Super Agent Error: ${err?.message || 'Connection failed'}. Check OpenRouter API key setting.`;
    }
  }

  return `⚠️ Super Agent Error: OpenRouter API model endpoint not found (${lastErrorMsg}). Please check selected model or API key.`;
}
