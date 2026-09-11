// Port accessor Laravel Berita: getWaktuTampil + getJamTampil.

export function waktuTampil(createdAt: Date): string {
  const now = Date.now();
  const diffMs = now - createdAt.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  return `${Math.floor(hours / 24)} hari yang lalu`;
}

export function jamTampil(createdAt: Date): string {
  const hours = (Date.now() - createdAt.getTime()) / 3600000;
  if (hours < 24) {
    const hh = String(createdAt.getHours()).padStart(2, "0");
    const mm = String(createdAt.getMinutes()).padStart(2, "0");
    return `${hh}:${mm} WIB`;
  }
  return `${Math.floor(hours / 24)} hari yang lalu`;
}
