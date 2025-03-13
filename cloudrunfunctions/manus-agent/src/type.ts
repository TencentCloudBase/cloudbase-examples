import type { ClientCapabilities } from '@modelcontextprotocol/sdk/types.js';
import type { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import type { StdioServerParameters } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CloudBase } from '@cloudbase/node-sdk'

export interface IMcpConfig {
    name: string;
    server: StdioServerParameters | SSEClientParameters;
    capabilities?: ClientCapabilities;
    version?: string;
}

declare type SSEClientParameters = {
    url: URL;
} & ConstructorParameters<typeof SSEClientTransport>[1];

export interface ICreateAgentOptions {
    tcb: CloudBase,
}