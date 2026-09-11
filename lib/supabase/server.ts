import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} belum diisi (lihat .env.example)`);
  return v;
}

// Client Supabase untuk Server Components / Server Actions / Route Handlers.
// Session dibaca-tulis lewat cookies (refresh otomatis via middleware).
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // dipanggil dari Server Component (read-only) — diabaikan,
            // karena middleware sudah me-refresh session.
          }
        },
      },
    },
  );
}
