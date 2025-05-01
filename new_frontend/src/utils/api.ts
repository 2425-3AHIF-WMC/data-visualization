
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function apiFetch<T>(
    path: string,
    method: Method = 'GET',
    body?: Record<string, any>,
    customHeaders: HeadersInit = {}
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    const res = await fetch(import.meta.env.VITE_API_URL + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
     //   credentials: 'include', // falls du Cookies brauchst
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${res.status}`);
    }

    return res.json();
}
