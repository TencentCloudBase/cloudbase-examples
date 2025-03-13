import { MastraMCPClient } from "@mastra/mcp";
import type { IMcpConfig } from '../type.js'

export class McpManager {
    private mcpClients: MastraMCPClient[];
    private ttl: number;
    private lastActivity: number = 0;
    private sessionId: string;
    private timeoutId: NodeJS.Timeout | null = null;
    private isConnected: boolean = false;
    private static registry: Map<string, McpManager> = new Map();

    constructor(
        sessionId: string,
        mcpConfigs: IMcpConfig[],
        ttl: number = 300000 // 默认300秒不活动断开连接
    ) {
        this.mcpClients = mcpConfigs.map(mcpConfig => new MastraMCPClient(mcpConfig));
        this.ttl = ttl;
        this.sessionId = sessionId;
        McpManager.registry.set(sessionId, this);
    }

    public static getInstance(sessionId: string, mcpConfigs: IMcpConfig[], ttl: number = 300000) {
        return McpManager.registry.get(sessionId) || new McpManager(sessionId, mcpConfigs, ttl);
    }


    private async maintainConnection() {
        console.log('maintainConnection', this.isConnected, this.sessionId);
        if (!this.isConnected) {
            await Promise.all(this.mcpClients.map(client => client.connect()));
            this.isConnected = true;
        }
        this.resetInactivityTimer();
    }

    private resetInactivityTimer() {
        this.lastActivity = Date.now();
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
            this.handleDisconnection();
        }, this.ttl);
    }

    private async handleDisconnection() {
        if (this.isConnected && Date.now() - this.lastActivity >= this.ttl) {
            await Promise.all(this.mcpClients.map(client => client.disconnect()));
            this.isConnected = false;
            McpManager.registry.delete(this.sessionId);
        }
    }

    public async getTools() {
        await this.maintainConnection();
        const clients = await Promise.all(this.mcpClients.map(async item => {
            const tools = await item.tools();
            return [item.name, tools]
        }))
        return clients.reduce((tools, [name, tool]) => ({
            ...tools,
            [name as string]: tool
        }), {});

    }

    public async getResources() {
        await this.maintainConnection();
        // 实现资源获取逻辑
    }

    public async getPrompts() {
        await this.maintainConnection();
        // 实现提示获取逻辑
    }

    public async forceDisconnect() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        await this.handleDisconnection();
    }
}