"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { TeamsCatalog } from "@/components/team/teams-catalog";
import { ErrorBoundary } from "react-error-boundary";

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary fallback={<div>Error fetching teams</div>}>
        <TeamsCatalog />
      </ErrorBoundary>
    </Suspense>
  );
}
