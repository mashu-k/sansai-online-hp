"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OldEditPage() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => { router.replace(`/admin/posts/edit/${params.id}`); }, [router, params]);
  return null;
}
