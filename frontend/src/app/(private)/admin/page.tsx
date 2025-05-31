"use client";
import CsvUploadForm from "@/components/forms/csv-upload";
import { useSessionStore } from "@/store/session";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { user } = useSessionStore();

  if (user?.role !== "admin") redirect("/");

  return (
    <div>
      <div className="flex items-start justify-between">
        <h1>Admin Page</h1>
        <CsvUploadForm />
      </div>
    </div>
  );
}
