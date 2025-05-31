"use client";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/session";
import { UploadCloud } from "lucide-react";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { user } = useSessionStore();

  if (user?.role !== "admin") redirect("/");

  return (
    <div>
      <div className="flex items-start justify-between">
        <h1>Admin Page</h1>
        <Button>
          <UploadCloud size={16} /> Student CSV
        </Button>
      </div>
    </div>
  );
}
