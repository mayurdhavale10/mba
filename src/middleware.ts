// middleware.ts
export { auth as middleware } from "@/auth";

// Protect only these paths (add more as needed)
export const config = {
  matcher: ["/(protected)(.*)", "/api/sessions"],
};
