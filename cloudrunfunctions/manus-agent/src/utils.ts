export const customFetch = async (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> => {
    let body = init?.body
    if (typeof body === 'string') {
        body = processBody(body)
    }

    console.log(`fetching ${input}`, JSON.stringify(init))

    return fetch(input, {
        ...(init || {}),
        body
    })
}

function processBody(body: string): string {
    console.log(body)


    return preprocess(body)
}

function preprocess(obj: string) {
    return JSON.stringify(JSON.parse(obj), (key, value) => {
        if (key === 'type' && Array.isArray(value)) {
            return value.filter(item => item !== 'null')[0]
        }
        return value;
    })
}

export function normalizeToolCall(mastraToolCall: any) {
    return {
        id: mastraToolCall.toolCallId,
        type: 'function',
        function: {
            name: mastraToolCall.toolName,
            arguments: mastraToolCall.args
        }
    }
}