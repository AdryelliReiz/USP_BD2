import { ISession } from "@/middleware";
import { decodeJwt } from "jose";

export async function deleteSession() {
    await fetch('/api/session', { method: 'DELETE' });
}

export async function createSession(access_token: string) {
    await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token }),
    });
}

export async function getUserSession() {
    const response = await fetch('/api/session', { method: 'GET' });
    if (!response.ok) return null;

	const data = await response.json();
	
	if (!data.session) return null;

    const payload = decodeJwt(data.session)

    const session = payload as ISession;

	return session;
}
