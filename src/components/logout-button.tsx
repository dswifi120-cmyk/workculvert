"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";

export function LogoutButton({
  kind,
  label,
  className,
}: {
  kind: "worker" | "admin";
  label: string;
  className: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    if (loading) return;
    setLoading(true);
    await fetch(kind === "admin" ? "/api/admin/logout" : "/api/worker/logout", {
      method: "POST",
    }).catch(() => undefined);
    router.push(kind === "admin" ? "/admin/login" : "/");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} disabled={loading} className={className}>
      {loading ? <LoaderCircle size={16} className="animate-spin" /> : <LogOut size={16} />}
      {label}
    </button>
  );
}
