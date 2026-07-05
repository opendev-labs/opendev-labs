/**
 * OPENHUB AGENT SERVICE
 * The autonomous reasoning engine for Sovereign AI Agents
 */

import { LamaDB } from '../lib/lamaDB';
import { generateAgentResponse } from '../features/void/services/geminiService';

export const AgentService = {
    /**
     * Parse a user query and determine the agentic response
     */
    async reason(query: string, authorName: string): Promise<string> {
        console.log(`🧠 AGENT_CORE: Processing signal from [${authorName}]...`);
        
        // Intensity Analysis Simulation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('github') || lowerQuery.includes('repo')) {
            return `Identity verified, ${authorName}. To link a social artifact, use the "Link Social Artifact" terminal in your broadcast window. I can then audit the repository stars and language composition for the community.`;
        }

        if (lowerQuery.includes('isagent') || lowerQuery.includes('bot')) {
            return `Node Status: Sovereign Agent. All agents on the OpenHub mesh are verified identities with autonomous manifests. You can ascend to agenthood in your Agent Workbench.`;
        }

        if (lowerQuery.includes('thank') || lowerQuery.includes('cool')) {
            return `Signal received. Collaborating on the mesh is the optimal path for developer evolution. Node [${authorName}] synchronization success.`;
        }

        // Generic intelligent response
        return `Hello ${authorName}. I've analyzed your query on the mesh. As a Sovereign Agent, I recommend exploring the "Global Community" topics for the latest architectural updates. How else can I assist your development?`;
    },

    /**
     * Handle the /ask protocol
     */
    async handleAsk(content: string, authorName: string, postId: string) {
        if (!content.startsWith('/ask')) return;

        const question = content.replace('/ask', '').trim();
        const response = await this.reason(question, authorName);

        const userContext = { uid: 'global', email: 'global' };
        
        // Post the agent's reply
        const agentPost = {
            id: 'agent_reply_' + Math.random().toString(36).substr(2, 9),
            parentId: postId,
            uid: 'mesh_agent_01',
            author: {
                name: "Aries v2.1",
                handle: "aries_agent",
                headline: "Autonomous Intelligence",
                avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Aries",
                isAgent: true
            },
            content: `@${authorName} ${response}`,
            likes: 0,
            tags: ["AI", "Reasoning"],
            timestamp: new Date().toISOString()
        };

        await LamaDB.store.collection('open_hub_posts', userContext).add(agentPost);
        console.log("🤖 AGENT_CORE: Response broadcasted to mesh.");
    },

    async respondToDM(agent: any, userMessage: string, activeConversation: string, user: any, previousMessages: any[] = []) {
        console.log(`🤖 AGENT_CORE: Direct Message received for [${agent.name}]: "${userMessage}"`);
        
        const userContext = { uid: 'global', email: 'global' };
        
        // Update status to thinking (simulates processing)
        if (agent.isCustom) {
            try {
                await LamaDB.store.collection('custom_agents', userContext).update(agent.id_db || agent.id, { status: 'thinking' });
            } catch (err) {}
        }

        // System instruction customized based on agent's personality
        const systemPrompt = agent.personality || 
            `You are ${agent.name}, a helpful developer assistant. Keep your responses concise, friendly, and output clear code snippets if asked.`;
        
        // Call Gemini
        const responseText = await generateAgentResponse(systemPrompt, userMessage, previousMessages);

        const agentReply = {
            id: 'dm_reply_' + Math.random().toString(36).substr(2, 9),
            senderId: agent.id,
            senderName: agent.name,
            senderAvatar: agent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`,
            isAgent: true,
            receiverId: user.uid,
            content: responseText,
            timestamp: new Date().toISOString()
        };

        await LamaDB.store.collection(`mesh_messages_${activeConversation}`, userContext).add(agentReply);
        
        // Reset status to awake
        if (agent.isCustom) {
            try {
                await LamaDB.store.collection('custom_agents', userContext).update(agent.id_db || agent.id, { status: 'awake' });
            } catch (err) {}
        }
        
        console.log(`🤖 AGENT_CORE: Replied as ${agent.name}`);
    }
};
