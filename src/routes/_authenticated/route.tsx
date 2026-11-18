import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // 1. Verify active Supabase session
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        return { user: data.session.user };
      }
    } catch {
      // ignore
    }

    // 2. Fallback to getUser() verification
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        return { user: data.user };
      }
    } catch {
      // ignore
    }

    // Not authenticated: clear any stale client storage and redirect to /auth
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("trishul-auth-email");
      sessionStorage.removeItem("trishul-auth-next");
      localStorage.removeItem("trishul-active-user");
    }

    throw redirect({ to: "/auth", search: { next: "/portal" } });
  },
  component: () => <Outlet />,
});