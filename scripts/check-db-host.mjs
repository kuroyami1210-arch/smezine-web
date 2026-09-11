// Penjaga build: tolak format host DB lama yang IPv6-only.
// Host `db.[REF].supabase.co` tidak terjangkau dari jaringan IPv4 maupun
// runtime Vercel (P1001 DatabaseNotReachable). Wajib pakai regional pooler:
//   postgresql://postgres.[REF]:[PW]@aws-0-[REGION].pooler.supabase.co:6543/...
// Lihat .env.example. Gagal cepat di sini dengan pesan jelas, bukan 500 pas runtime.

const url = process.env.DATABASE_URL ?? "";

if (!url) {
  console.error(
    "[check-db-host] DATABASE_URL belum diisi. Isi di Vercel: Settings → Environment Variables.",
  );
  process.exit(1);
}

let host = "";
try {
  host = new URL(url).hostname;
} catch {
  console.error("[check-db-host] DATABASE_URL bukan URL valid.");
  process.exit(1);
}

if (/^db\..*\.supabase\.co$/i.test(host)) {
  console.error(
    `[check-db-host] Host "${host}" IPv6-only dan tidak terjangkau Vercel (P1001).`,
  );
  console.error(
    "[check-db-host] Ganti DATABASE_URL (+ DIRECT_URL) ke regional pooler IPv4, contoh:",
  );
  console.error(
    "[check-db-host] postgresql://postgres.[REF]:[PW]@aws-0-ap-northeast-1.pooler.supabase.co:6543/postgres?pgbouncer=true",
  );
  process.exit(1);
}

console.log(`[check-db-host] OK (${host})`);
