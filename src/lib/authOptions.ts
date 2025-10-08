import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import { env } from "@/lib/env";

type TokenExt = JWT & { provider?: string | undefined };

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      const t = token as TokenExt;
      if (account) t.provider = account.provider;
      return t;
    },
    async session({ session, token }) {
      const t = token as TokenExt;
      session.provider = t.provider;
      session.user = { ...session.user, id: t.sub ?? null };
      return session;
    },
  },
};
