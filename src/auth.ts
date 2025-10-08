import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { env } from "@/lib/env";

type TokenExt = { provider?: string; sub?: string | null };

export const { auth, signIn, signOut } = NextAuth({
  providers: [GitHub({ clientId: env.GITHUB_ID, clientSecret: env.GITHUB_SECRET })],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) (token as TokenExt).provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      const t = token as TokenExt;
      session.provider = t.provider;
      session.user = { ...session.user, id: t.sub ?? null };
      return session;
    },
  },
});
