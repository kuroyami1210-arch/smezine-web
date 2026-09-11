import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

// User login saat ini, atau null kalau belum login.
export async function currentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Guard halaman admin: tendang ke /login kalau belum login.
export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}
