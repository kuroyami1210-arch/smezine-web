import { db } from "../../../lib/db";
import Slide1Form from "./Slide1Form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Slide 1 - Admin" };

export default async function Slide1Page() {
  const slide1 = await db.tentangSlide1.findFirst();

  return (
    <Slide1Form
      initial={{
        judul: slide1?.judul ?? "",
        deskripsi: slide1?.deskripsi ?? "",
        fotoUrl: slide1?.fotoUrl ?? null,
      }}
    />
  );
}
