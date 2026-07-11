import { API_URL } from "@constants/API";

/**
 * Thin fetch wrapper for the task manager API. Adds the JSON content-type,
 * throws on non-2xx so react-query treats it as an error, and safely handles
 * empty 204 No Content responses (the API returns those on PUT and DELETE).
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        throw new Error(`Request to ${path} failed (${res.status} ${res.statusText})`);
    }

    if (res.status === 204) {
        return undefined as T;
    }

    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
}
