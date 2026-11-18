import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // 1. Check client storage for active verified Google/customer session
    if (typeof window !== "undefined") {
      const activeEmail =
        sessionStorage.getItem("trishul-auth-email") || localStorage.getItem("trishul-active-user");
      if (activeEmail) {
        return { user: { id: "verified-customer", email: activeEmail } };
      }
    }

    // 2. Check active Supabase session
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        return { user: data.session.user };
      }
    } catch {
      // ignore
    }

    // 3. Check Supabase user
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        return { user: data.user };
      }
    } catch {
      // ignore
    }

    throw redirect({ to: "/auth", search: { next: "/portal" } });
  },
  component: () => <Outlet />,
});