import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    return new Response(JSON.stringify({ session: session?.value || null }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(request: Request) {
    const { access_token } = await request.json();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const cookieStore = await cookies();
    cookieStore.set('session', access_token, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });

    return new Response(null, { status: 200 });
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return new Response(null, { status: 204 });
}
