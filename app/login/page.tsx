import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Login Admin Smezine" };

export default async function LoginPage() {
  // sudah login? langsung ke admin
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/admin/berita");

  return <LoginForm />;
}
