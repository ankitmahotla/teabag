"use client";
import { CreateTeam } from "@/components/home/create-team";
import { Teams } from "@/components/home/teams";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="px-4 py-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Home Page</h1>
      </header>

      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-12 mb-6 gap-4">
        <h2 className="text-lg font-semibold">All Teams</h2>
        <CreateTeam />
      </section>

      <Suspense fallback={<div>Loading...</div>}>
        <Teams />
      </Suspense>
    </main>
  );
}
