export async function fetcher<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res.json() as Promise<T>;
}
