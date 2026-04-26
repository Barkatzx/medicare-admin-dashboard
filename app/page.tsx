// src/app/page.tsx
import { redirect } from "next/navigation";

// Fallback: middleware handles this, but just in case
export default function Home() {
  redirect("/login");
}
