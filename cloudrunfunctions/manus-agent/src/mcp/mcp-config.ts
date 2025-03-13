import { IMcpConfig } from '../type.js'

export async function getMcpByAgent(agent: string, {
    userId
}: { userId: string }): Promise<IMcpConfig[]> {
    if (agent === 'manus') {
        return [
            {
                name: 'puppeteer',
                server: {
                    url: new URL("https://cloudrunmcp-puppete-135154-9-1257967285.sh.run.tcloudbase.com/sse"),
                    // Optional fetch request configuration
                    requestInit: {
                        headers: {
                            // Authorization: "Bearer your-token",
                        },
                    },
                },
            },
            {
                name: 'memory',
                server: {
                    url: new URL('https://cloudrunmcp-memory-135154-9-1257967285.sh.run.tcloudbase.com/sse'),
                    eventSourceInit: {
                        fetch: (x, init = {}) =>
                            fetch(x, {
                                ...init,
                                headers: {
                                    ...init.headers,
                                    "x-cloudbase-user-id": userId
                                },
                            }),
                    },
                    requestInit: {
                        headers: {
                            "x-cloudbase-user-id": userId
                        },
                    },
                }
            }
        ]
    } else {
        return []
    }

}