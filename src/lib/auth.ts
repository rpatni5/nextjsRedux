import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: "Ov23liWUsyFijK5s655y",
            clientSecret: "85cbd0420de6eb7b6729fc21ab80ee87f65733ad",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Missing email or password")
                }
                try {
                    await connectToDatabase();
                    const user = await User.findOne({
                        email:
                            credentials.email
                    })
                    if (!user) {
                        throw new Error("No user found with this")
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password, user.password
                    )
                    if (!isValid) {
                        throw new Error("Invalid Password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role :user.role,
                        name :user.name
                    }
                } catch (error) {
                    console.error("auth error", error)
                    throw error

                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                const dbUser = await User.findById(user.id);
                token.role = dbUser.role;
            
            }
            return token
        },
        async session({ session, token }) {
            if (session) {
                session.user.id = token.id as string,
                session.user.role = token.role as string;
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRETS

};