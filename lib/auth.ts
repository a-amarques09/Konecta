import NextAuth, { type NextAuthOptions, DefaultSession } from 'next-auth';
import type {
    Adapter,
    AdapterAccount,
    AdapterSession,
    AdapterUser,
    VerificationToken,
} from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getDb } from './prisma';
import service from '../service.mjs';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        role: string;
    }
}

function isAdapterUser(row: unknown): row is AdapterUser {
    return !!row;
}

/**
 * next-auth adapter backed by the Prisma ORM 8 client from the service's
 * database dependency, replacing `@next-auth/prisma-adapter` (which speaks
 * the Prisma ORM 6 call shape).
 */
function ormAdapter(): Adapter {
    const db = getDb();
    const { User, Account, Session, VerificationToken } = db.orm.public;

    return {
        async createUser(data: Omit<AdapterUser, 'id'>) {
            const row = await User.create({
                ...data,
                role: data.role as 'CUSTOMER' | 'SELLER' | 'ADMIN' | undefined,
            });
            return isAdapterUser(row) ? row : null;
        },
        async getUser(id: string) {
            return (await User.first({ id })) ?? null;
        },
        async getUserByEmail(email: string) {
            return (await User.where((u) => u.email.eq(email)).first()) ?? null;
        },
        async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
            const account = await Account.where({ provider, providerAccountId }).first();
            if (!account) return null;
            return (await User.first({ id: account.userId })) ?? null;
        },
        async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
            const { id, ...changes } = data;
            const row = await User.where({ id }).update(changes as never);
            if (!row) throw new Error(`User ${id} not found`);
            return row as AdapterUser;
        },
        async deleteUser(id) {
            await User.where({ id }).delete();
            return null;
        },
        async linkAccount(data: AdapterAccount) {
            await Account.create(data);
            return data;
        },
        async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
            await Account.where({ provider, providerAccountId }).delete();
            return undefined;
        },
        async createSession(data): Promise<AdapterSession> {
            return (await Session.create(data)) as AdapterSession;
        },
        async getSessionAndUser(sessionToken) {
            const session = await Session.where({ sessionToken }).first();
            if (!session) return null;
            const user = await User.first({ id: session.userId });
            if (!user) return null;
            return { session, user };
        },
        async updateSession(data) {
            const { sessionToken, ...changes } = data;
            return (await Session.where({ sessionToken }).update(changes)) ?? null;
        },
        async deleteSession(sessionToken) {
            return (await Session.where({ sessionToken }).delete()) ?? null;
        },
        async createVerificationToken(data: VerificationToken) {
            return (await VerificationToken.create(data)) ?? null;
        },
        async useVerificationToken({ identifier, token }) {
            const existing = await VerificationToken.where({ identifier, token }).first();
            if (!existing) return null;
            await VerificationToken.where({ identifier, token }).delete();
            return existing;
        },
    };
}

export function getAuthOptions(): NextAuthOptions {
    const input = service.input();
    return {
        adapter: ormAdapter(),
        providers: [
            CredentialsProvider({
                name: 'credentials',
                credentials: {
                    email: { label: 'Email', type: 'email' },
                    password: { label: 'Password', type: 'password' },
                },
                async authorize(credentials) {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('Email e senha são obrigatórios');
                    }

                    const db = getDb();
                    const user = await db.orm.public.User.where((u) =>
                        u.email.eq(credentials.email)
                    ).first();

                    if (!user || !user.password) {
                        throw new Error('Credenciais inválidas');
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error('Credenciais inválidas');
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                    };
                },
            }),
        ],
        session: {
            strategy: 'jwt',
        },
        callbacks: {
            async jwt({ token, user }) {
                if (user) {
                    token.id = user.id;
                    token.role = user.role;
                }
                return token;
            },
            async session({ session, token }) {
                if (session.user) {
                    session.user.id = token.id as string;
                    session.user.role = token.role as string;
                }
                return session;
            },
        },
        pages: {
            signIn: '/login',
            error: '/login',
        },
        secret: input.nextAuthSecret.expose(),
    };
}

const handler = (req: import('next').NextApiRequest, res: import('next').NextApiResponse) =>
    NextAuth(req, res, getAuthOptions());

export { handler, handler as GET, handler as POST };
