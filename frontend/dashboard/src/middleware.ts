import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

type NewType = {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: string;
    nome: string;
    sobrenome: string;
    cinema_id: string;
    cinema_nome: string;
    role: "admin" | "gerente";
    access_token: string;
};

export type ISession = NewType;

// Rotas protegidas e específicas
const protectedRoutes = ['/dashboard'];
const gerenteAllowedRoutes = ['/dashboard/cinemas/']; // Rotas permitidas para gerente

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Verificar se a rota é protegida
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

    // Obter o token de acesso
    const access_token = req.cookies.get('session')?.value;

    // Caso não haja token, redirecionar para login em rotas protegidas
    if (!access_token) {
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        return NextResponse.next();
    }

    // Verificar o token
    let session: ISession;
    try {
        const payload = decodeJwt(access_token) as NewType;

        session = {
            token_type: payload.token_type,
            exp: payload.exp,
            iat: payload.iat,
            jti: payload.jti,
            user_id: payload.user_id,
            nome: payload.nome,
            sobrenome: payload.sobrenome,
            cinema_id: payload.cinema_id,
            cinema_nome: payload.cinema_nome,
            role: payload.role,
            access_token: access_token
        };
    } catch (error) {
        console.log(error);
        // Token inválido ou expirado
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        return NextResponse.next();
    }

    // Controle de acesso para admins
    if (session.role === 'admin') {
        return NextResponse.next(); // Admins têm acesso irrestrito
    }

    // Controle de acesso para gerentes
    if (session.role === 'gerente') {
        const isAllowedForGerente = gerenteAllowedRoutes.some((route) =>
            path.startsWith(route)
        );
        if (!isAllowedForGerente) {
            return NextResponse.redirect(new URL(`/dashboard/cinemas/${session.cinema_id}`, req.nextUrl));
        }
        return NextResponse.next();
    }

    // Caso o tipo de usuário não seja reconhecido
    if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
}

// Configuração do middleware
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
