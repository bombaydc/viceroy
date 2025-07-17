export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions {
    method?: ApiMethod;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
    baseUrl?: string;
}

const buildQueryString = (params?: Record<string, any>): string => {
    if (!params) return '';
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value));
        }
    });
    return `?${query.toString()}`;
};


export async function callApi<T = any>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const {
        method = 'GET',
        headers = {},
        params,
        body,
        baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
    } = options;

    if (!baseUrl) {
        throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in environment');
    }

    const queryString = buildQueryString(params);
    const url = `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}${queryString}`; 

    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, fetchOptions); 

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData?.message || `API error: ${response.statusText}`
            );
        }

        const data: T = await response.json();
        return data;
    } catch (err: any) {
        console.error('API Request Failed:', err.message);
        throw err;
    }
}
