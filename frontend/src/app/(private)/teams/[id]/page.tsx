"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { Team } from "@/components/team/team";
import { ErrorBoundary } from "react-error-boundary";

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary fallback={<div>Team not found</div>}>
        <Team />
      </ErrorBoundary>
    </Suspense>
  );
}
