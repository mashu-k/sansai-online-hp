"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OldNewPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/posts/new"); }, [router]);
  return null;
}
