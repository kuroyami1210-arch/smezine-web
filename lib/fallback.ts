// Port accessor Laravel: Anggota::fotoUrl + TentangSlide1::fotoUrl.

export function anggotaFotoUrl(
  nama: string,
  jabatan: string,
  fotoUrl?: string | null,
): string {
  if (fotoUrl) return fotoUrl;
  const isKetuaUmum = jabatan.toLowerCase().includes("ketua umum");
  const bg = isKetuaUmum ? "2997ff" : "333";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${bg}&color=fff&size=256`;
}

export function slide1FotoUrl(fotoUrl?: string | null): string {
  if (fotoUrl) return fotoUrl;
  return "https://www.pngmart.com/files/4/Haikyuu-PNG-Photos.png";
}
