"use client";
import { CreateTeam } from "@/components/home/create-team";
import { Teams } from "@/components/home/teams";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">All Teams</h2>
        <CreateTeam />
      </section>

      <Suspense fallback={<Loader className="h-6 w-6 animate-spin" />}>
        <Teams />
      </Suspense>
    </>
  );
}
